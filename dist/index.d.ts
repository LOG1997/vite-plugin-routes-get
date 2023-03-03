import { PluginOption } from 'vite';

type UserOptions = {
    dirname: string;
    defaultFile: string;
    type: string;
};
declare function vitePluginRouteGet(userOptions?: UserOptions): PluginOption;

export { vitePluginRouteGet as default };
