import { execAsync } from "astal"

export function bash(cmd: string): void {
execAsync(["bash", "-c", `${cmd} &`])
    .then((out) => console.log(out))
    .catch((err) => console.error(err))
}
