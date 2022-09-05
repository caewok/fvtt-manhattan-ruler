/* globals
canvas,
ui
*/
"use strict";

import { getSetting, SETTINGS } from "./settings.js";
import { log } from "./module.js";

/**
 * Wrap GridLayer.prototype.measureDistances
 * Called by Ruler.prototype._computeDistance
 * For better compatibility with other modules, get the segment distances for the
 * x and y directions separately, using the underlying measure.
 */
export function measureDistancesGridLayer(wrapped, segments, options = {}) {
  if ( getSetting(SETTINGS.ADD_CONTROL) ) {
    const token_controls = ui.controls.controls.find(elem => elem.name === "token");
    const manhattan_control = token_controls.tools.find(elem => elem.name === "manhattan-distance");
    if ( !manhattan_control.active ) return wrapped(segments, options);
  }

  if ( !segments.length ) return wrapped(segments, options);

  // Construct new segments, creating zig-zag moving in x and then y directions
  const newSegments = [];
  for ( const s of segments ) {
    // Shallow-copy the segment properties so they are available to the wrapped method.
    const xSegment = {...s};
    const ySegment = {...s};

    // Don't copy the ray segment references.
    const { A, B } = s.ray;
    xSegment.ray = new Ray({ x: A.x, y: A.y }, { x: B.x, y: A.y });
    ySegment.ray = new Ray({ x: B.x, y: A.y }, { x: B.x, y: B.y });

    newSegments.push(xSegment, ySegment);
  }

  const distances = wrapped(newSegments, options);

  // Re-combine so the distance lengths match the segment lengths.
  const combinedDistances = [];
  const ln = distances.length;
  for ( let i = 0; i < ln; i += 2 ) combinedDistances.push(distances[i] + distances[i + 1]);
  return combinedDistances;
}

