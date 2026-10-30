import { Config } from '@remotion/cli/config';

// CHROME_PATH: usa um Chrome já instalado; sem ele, o Remotion baixa o Chrome Headless Shell na primeira vez.
if (process.env.CHROME_PATH) Config.setBrowserExecutable(process.env.CHROME_PATH);
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setOverwriteOutput(true);
