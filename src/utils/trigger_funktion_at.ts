import { test } from "./test"



interface TriggerFunctionAtArgs
{
    funktion: () => void
    delay_ms: number
    loop_ms: number
    start_ms: number
    tolerance_ms?: number
    attempts_remaining?: number
}
// We use this function as during start up / running there may be delays in the setTimeout
// that result in it firing significantly later than expected.  For animating a series of
// components such as puffs of smoke in a smoke plume, this results in distracting /
// un-appealing / confusing gaps and clumps.  This function is an attempted work around
// for that problem.
export function trigger_function_at (args: TriggerFunctionAtArgs)
{
    const { tolerance_ms = 20 } = args
    let { attempts_remaining = 5 } = args

    if (attempts_remaining <= 0)
    {
        console.warn(`Failed to start funktion: "${args.funktion.toString()}" on time`)
        args.funktion()
        return
    }

    const { with_in_tolerance, diff_ms } = is_within_tolerance({ ...args, tolerance_ms })

    if (with_in_tolerance)
    {
        args.funktion()
        return
    }

    const { aim_for_next_cycle, wait_for } = calc_wait_for({ diff_ms, loop_ms: args.loop_ms })

    setTimeout(() =>
    {
        attempts_remaining = attempts_remaining + (aim_for_next_cycle ? -1 : 0)

        if (aim_for_next_cycle)
        {
            // console .warn(`Aiming to start funktion next cycle in `, wait_for, " attempts remaining ", attempts_remaining)
        }
        else
        {
            // console .log(`Aiming to start funktion this cycle in `, wait_for, " attempts remaining ", attempts_remaining)
        }

        trigger_function_at({ ...args, tolerance_ms, attempts_remaining })
    }, wait_for)
}



function is_within_tolerance (args: { delay_ms: number, loop_ms: number, start_ms: number, tolerance_ms: number })
{
    const offset_ms = (performance.now() - args.start_ms) % args.loop_ms
    const diff_ms = args.delay_ms - offset_ms
    const with_in_tolerance = Math.abs(diff_ms) <= args.tolerance_ms

    return { with_in_tolerance, diff_ms }
}



function calc_wait_for (args: { diff_ms: number, loop_ms: number })
{
    const aim_for_next_cycle = args.diff_ms < 0
    const wait_for = aim_for_next_cycle
        ? args.loop_ms + args.diff_ms
        : args.diff_ms

    return { aim_for_next_cycle, wait_for }
}



function run_tests ()
{
    let start_ms = performance.now()
    const delay_ms = 150
    const loop_ms = 3000
    const tolerance_ms = 20

    let result_tolerance = is_within_tolerance({ delay_ms, loop_ms, start_ms, tolerance_ms })
    test(result_tolerance.with_in_tolerance, false)
    test(result_tolerance.diff_ms, delay_ms)

    result_tolerance = is_within_tolerance({ delay_ms, loop_ms, start_ms: performance.now() - delay_ms, tolerance_ms })
    test(result_tolerance.with_in_tolerance, true)
    test(result_tolerance.diff_ms, 0)

    result_tolerance = is_within_tolerance({ delay_ms, loop_ms, start_ms: performance.now() - delay_ms + tolerance_ms, tolerance_ms })
    test(result_tolerance.with_in_tolerance, true)
    test(result_tolerance.diff_ms, 20)

    result_tolerance = is_within_tolerance({ delay_ms, loop_ms, start_ms: performance.now() - delay_ms - tolerance_ms, tolerance_ms })
    test(result_tolerance.with_in_tolerance, true)
    test(result_tolerance.diff_ms, -20)

    result_tolerance = is_within_tolerance({ delay_ms, loop_ms, start_ms: performance.now() - delay_ms - tolerance_ms - 1, tolerance_ms })
    test(result_tolerance.with_in_tolerance, false)
    test(result_tolerance.diff_ms, -21)

    let result_wait_for = calc_wait_for({ diff_ms: 0, loop_ms })
    test(result_wait_for.aim_for_next_cycle, false)
    test(result_wait_for.wait_for, 0)

    result_wait_for = calc_wait_for({ diff_ms: 30, loop_ms })
    test(result_wait_for.aim_for_next_cycle, false)
    test(result_wait_for.wait_for, 30)

    result_wait_for = calc_wait_for({ diff_ms: -30, loop_ms })
    test(result_wait_for.aim_for_next_cycle, true)
    test(result_wait_for.wait_for, loop_ms - 30)
}

// run_tests()
