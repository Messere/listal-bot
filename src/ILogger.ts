import IImageStats from "./IImageStats";

export default interface ILogger {
    log(text: string);
    error(text: string);
    progress(imageStats: IImageStats);
}
