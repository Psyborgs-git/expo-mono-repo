import tamaguiConfig from '../../packages/ui/tamagui.config'

export default tamaguiConfig
export type Conf = typeof tamaguiConfig

// Module augmentation removed here to avoid TypeScript errors before
// installing Tamagui. Re-add the augmentation after installing tamagui in
// the workspace so editors/TS can pick up the custom config types.
