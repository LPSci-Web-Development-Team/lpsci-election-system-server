import pino from 'pino';

/* ANCHOR: Check if pretty print dependency exists -------------------------- */
function checkPrettyPrint() {
  try {
    require.resolve('pino-pretty');
    return true;
  } catch {
    return false;
  }
}

/* ANCHOR: Logger object ---------------------------------------------------- */
export const logger: pino.Logger = (() => {
  const prettyPrintExists = checkPrettyPrint();
  const pinoOptions: pino.LoggerOptions = {};

  if (prettyPrintExists) {
    pinoOptions.prettyPrint = { colorize: true };
  }

  return pino(pinoOptions);
})();
