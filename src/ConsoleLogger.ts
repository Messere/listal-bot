import IImageStats from "./IImageStats";
import ILogger from "./ILogger";

export default class ConsoleLogger implements ILogger {
    private readonly progressBarWidth = 30;

    public log(text: string) {
        process.stdout.write(text + "\n");
    }

    public error(text: string) {
        process.stderr.write(text + "\n");
    }

    public progress(imageStats: IImageStats) {
        const percent = Math.round(((imageStats.success + imageStats.error) * 100) / imageStats.total);
        const barSize = Math.round((this.progressBarWidth * percent) / 100);

        const info = `Done ${imageStats.success + imageStats.error} ` +
            `of ${imageStats.total} (errors: ${imageStats.error})`;

        const padding = "   ";
        const paddedPercent = padding.substring(0, padding.length - percent.toString().length) + percent.toString();
        const progressBar =
            `${paddedPercent}% [${"=".repeat(barSize)}>${" ".repeat(this.progressBarWidth - barSize)}] ${info}\r`;

        process.stdout.write(progressBar);
    }
}
