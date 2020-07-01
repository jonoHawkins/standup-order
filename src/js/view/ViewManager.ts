import View, { ViewProps } from "./AbstractView";

export default class ViewManager {
    protected views = new Map<string, View>();
    protected lastView?: View;
    protected lastElement?: HTMLElement;

    constructor(protected root = document.body) {}

    add(key: string, view: View) {
        this.views.set(key ,view);
        return this;
    }

    async render<T extends ViewProps>(key: string, props: T) {
        const view = this.views.get(key);

        if (this.lastElement) {
            if (this.lastView) {
                await this.lastView.willUnmount(this.lastElement);
            }

            this.lastElement.remove();
        }

        if (view) {
            const element = view.render(props);
            this.lastView = view;
            this.lastElement = element;
            this.root.appendChild(element);
            view.mounted(element, props);
        }

        return this;
    }
}