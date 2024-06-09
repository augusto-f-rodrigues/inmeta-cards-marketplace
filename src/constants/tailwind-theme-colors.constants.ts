import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export const orange500 = fullConfig.theme?.colors?.orange['500'];
export const teal500 = fullConfig.theme?.colors?.teal['500'];
