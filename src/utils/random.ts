


export function random_selection <V> (list: V[]): V
{
    const index = Math.floor(Math.random() * list.length)

    return list[index]
}



// https://stackoverflow.com/a/6274398/539490
export function shuffle <V> (list: V[]): V[]
{
    list = [...list]

    let counter = list.length

    // While there are elements in the list
    while (counter > 0) {
        // Pick a random index
        const index = Math.floor(Math.random() * counter)

        --counter
        ;[list[index], list[counter]] = [list[counter], list[index]]
    }


    return list
}
