// Shared silver lighting profile for all page-level GLB models.
// Kept in its own module so pages can pass these props without importing the heavy 3D scene.
export const SILVER_MODEL_LIGHTING_PROPS = {
  frontLight: true,
  ambientIntensity: 1.65,
  keyLightIntensity: 3.4,
  fillLightIntensity: 2.1,
  frontLightIntensity: 3.1,
  rimLightIntensity: 1.6,
  materialColor: '#dbe3ec',
  materialMetalness: 0.82,
  materialRoughness: 0.34,
  materialEnvMapIntensity: 2.4,
  materialEmissive: '#c9d2dc',
  materialEmissiveIntensity: 0.08,
  toneMappingExposure: 1.18,
}
