import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    // if (command === 'serve') {
    //     return {
    //       // dev specific config
    //     }
    // } else {
    //     // command === 'build'
    //     return {
    //         // build specific config
    //     }
    // }


    return {
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        },
        base: "sustainability-sims",
    };
});
