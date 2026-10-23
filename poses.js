// Hero poses, in skeleton coordinates (meters, y axis up).
// Indices follow the 17 COCO keypoints: 7 and 8 are the elbows, 9 and 10 the wrists.
// "headTilt" tilts the head forward (positive) or back; "lean" leans the torso.
export function vector(x, y, z) { return new THREE.Vector3(x, y, z); }
const V = vector;

// gestures: target arm positions and head tilt
export const GESTURES = {
  frontend: { p: { 7: V(0.36, 1.3, 0.14), 9: V(0.2, 1.6, 0.24), 8: V(-0.36, 1.3, 0.14), 10: V(-0.2, 1.6, 0.24) }, headTilt: 0 },
  thinking: { p: { 8: V(-0.2, 1.2, 0.24), 10: V(-0.04, 1.52, 0.17), 7: V(0.2, 1.16, 0.16), 9: V(-0.02, 1.2, 0.22) }, headTilt: 0.18 },
  team: { p: { 7: V(0.45, 1.3, 0.06), 9: V(0.7, 1.26, 0.12), 8: V(-0.45, 1.3, 0.06), 10: V(-0.7, 1.26, 0.12) }, headTilt: -0.08 },
  heart: { p: { 8: V(-0.24, 1.17, 0.2), 10: V(0.0, 1.32, 0.15) }, headTilt: 0.1 },
  raiseHand: { p: { 8: V(-0.3, 1.64, 0.02), 10: V(-0.32, 1.94, 0.02) }, headTilt: -0.1 },
  point: { p: { 8: V(-0.46, 1.38, 0.12), 10: V(-0.74, 1.36, 0.22) }, headTilt: 0 }
};
// bubble reaction for each gesture
export const REACTIONS = { frontend: '💻', thinking: '🤔', team: '🤝', heart: '💙', raiseHand: '📚', point: '📬' };
// poses for when nobody touches the page for a while
export const IDLE_POSES = [
  { name: 'stretch', reaction: '🥱', headTilt: -0.2, p: { 7: V(0.2, 1.72, 0.02), 9: V(0.08, 1.98, 0.03), 8: V(-0.2, 1.72, 0.02), 10: V(-0.08, 1.98, 0.03) } },
  { name: 'handsOnHips', reaction: '😎', headTilt: -0.05, lean: 0.04, p: { 7: V(0.38, 1.12, -0.03), 9: V(0.15, 0.98, 0.05), 8: V(-0.38, 1.12, -0.03), 10: V(-0.15, 0.98, 0.05) } },
  { name: 'crossArms', reaction: '🧐', headTilt: 0.08, p: { 7: V(0.2, 1.13, 0.18), 9: V(-0.13, 1.22, 0.21), 8: V(-0.2, 1.13, 0.18), 10: V(0.13, 1.25, 0.23) } },
  { name: 'scratchHead', reaction: '🤨', headTilt: 0.12, lean: -0.05, p: { 8: V(-0.33, 1.42, 0.1), 10: V(-0.1, 1.72, 0.03) } },
  { name: 'checkWatch', reaction: '⌚', headTilt: 0.38, p: { 7: V(0.17, 1.16, 0.22), 9: V(0.0, 1.3, 0.3) } },
  { name: 'dance', reaction: '🎵', headTilt: -0.05, dance: true, p: {} }
];
