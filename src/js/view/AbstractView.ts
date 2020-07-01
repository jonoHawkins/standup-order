
export type ViewProps = {
    ctx: {
        state: any,
        save(): void
    }
};

export default abstract class View<Props extends ViewProps = ViewProps> {
    abstract render(props: Props): HTMLElement
    mounted(root: HTMLElement, props: Props) { }
    willUnmount(root: HTMLElement) { }
}