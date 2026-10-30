#!/bin/sh
# Executa os testes contra os vaults reais em modo SOMENTE LEITURA (nenhum arquivo é escrito nos vaults).
# Caminhos podem ser sobrescritos por AKM_REAL_COFRE / AKM_REAL_HARNESS.
set -eu
COFRE="${AKM_REAL_COFRE:-$HOME/Downloads/Cofre do Pedro}"
HARNESS="${AKM_REAL_HARNESS:-$HOME/Downloads/Harness-Architecture}"
export AKM_REAL_VAULT_ROOTS="cofre=$COFRE;harness=$HARNESS"
export AKM_REAL_FULL_SCAN="${AKM_REAL_FULL_SCAN:-1}"
node --test --test-reporter=spec dist/tests/08-real-vaults.test.js
