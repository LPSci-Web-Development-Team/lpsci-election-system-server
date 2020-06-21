/* eslint-disable no-extend-native */
/* eslint-disable @typescript-eslint/unbound-method */

/**
 * ANCHOR: Configure date to JSON
 * Sets date to JSON as ISO 8601 string
 */
export function configureDateToJson(): void {
  Date.prototype.toJSON = function dateToJson() {
    const date = new Date(this);
    return date.toISOString();
  };
}
