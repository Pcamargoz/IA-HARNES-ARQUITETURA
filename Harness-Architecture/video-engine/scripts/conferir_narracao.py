"""Confere a narração de um vídeo: transcreve cada trecho (faster-whisper, na CPU) e compara com a fala do roteiro.

Pega o que o ouvido pega tarde demais: palavra cortada no começo ou no fim, frase engolida, trecho mudo. Foi o caso do
áudio cortado em 0:59 do vídeo de Tarefas (documento de melhorias de 24/10/2026).

Uso (com o Python do VoiceStudio, que já tem o faster-whisper):
  <python do VoiceStudio, com faster-whisper> scripts/conferir_narracao.py <id> [--modelo small]
Sai com código 1 se algum trecho ficar abaixo de 85% de palavras reconhecidas ou perder palavras na ponta.
"""
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
args = sys.argv[1:]
if not args:
    sys.exit(__doc__)
vid = args[0]
modelo = args[args.index("--modelo") + 1] if "--modelo" in args else "small"

UNIDADES = {"0": "zero", "1": "um", "2": "dois", "3": "tres", "4": "quatro", "5": "cinco", "6": "seis", "7": "sete",
            "8": "oito", "9": "nove", "10": "dez"}


NUMERICAS = set(("zero um uma dois duas tres quatro cinco seis sete oito nove dez onze doze treze quatorze catorze quinze "
                 "dezesseis dezessete dezoito dezenove vinte trinta quarenta cinquenta sessenta setenta oitenta noventa cem "
                 "cento duzentos trezentos quatrocentos quinhentos seiscentos setecentos oitocentos novecentos mil milhao "
                 "milhoes e reais real centavos centavo por cento").split())


def palavras(texto: str) -> list[str]:
    t = unicodedata.normalize("NFD", texto.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    t = re.sub(r"[^a-z0-9 ]+", " ", t)
    return [UNIDADES.get(p, p) for p in t.split()]


from faster_whisper import WhisperModel  # noqa: E402  (depois do --help, que não precisa do modelo)

roteiro = json.loads((RAIZ / "roteiros" / f"{vid}.json").read_text(encoding="utf-8"))
pasta = RAIZ / "public" / "audio" / vid
m = WhisperModel(modelo, device="cpu", compute_type="int8")
problemas = 0
for t in roteiro["trechos"]:
    wav = pasta / f"{t['id']}.wav"
    if not t.get("fala"):
        continue
    if not wav.exists():
        print(f"  {t['id']}: sem áudio")
        problemas += 1
        continue
    segs, _ = m.transcribe(str(wav), language="pt", beam_size=5, vad_filter=False)
    ouvido = " ".join(s.text for s in segs)
    # números: o roteiro fala por extenso ("setenta e cinco reais") e o Whisper escreve algarismos ("R$ 75", "003");
    # as duas formas saem da comparação para só sobrar o que é texto (sem isso, todo trecho com valor parecia cortado)
    esperado = [p for p in palavras(t["fala"]) if p not in NUMERICAS]
    obtido = [p for p in palavras(ouvido) if p not in NUMERICAS and not re.search(r"\d", p) and p != "r"]
    sm = difflib.SequenceMatcher(a=esperado, b=obtido, autojunk=False)
    casadas = sum(b.size for b in sm.get_matching_blocks())
    taxa = casadas / max(1, len(esperado))
    # pontas: uma das 2 primeiras e uma das 2 últimas palavras esperadas precisa aparecer perto das pontas do que foi ouvido
    inicio_ok = any(p in obtido[:6] for p in esperado[:2])
    fim_ok = any(p in obtido[-6:] for p in esperado[-2:])
    ruim = taxa < 0.85 or not inicio_ok or not fim_ok
    problemas += ruim
    marca = "REVER" if ruim else "ok"
    print(f"  {t['id']}: {marca} {taxa:.0%}" + ("" if inicio_ok else " · começo cortado?") + ("" if fim_ok else " · fim cortado?"))
    if ruim:
        print(f"      roteiro: {t['fala']}")
        print(f"      ouvido : {ouvido.strip()}")
print(f"conferência da narração de {vid}: {problemas} trecho(s) para rever")
sys.exit(1 if problemas else 0)
