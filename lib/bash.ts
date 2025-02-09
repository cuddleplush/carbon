import { execAsync } from "astal"

// Ugly helper to run things from bash
export default function bash(cmd: string): void {
execAsync(["bash", "-c", `${cmd} &`])
    .then((out) => console.log(out))
    .catch((err) => console.error(err))
}
