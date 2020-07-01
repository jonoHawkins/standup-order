import page from 'page';
import View, { ViewProps } from "./AbstractView";

export default class IndexPage extends View {
    protected unremovedListeners: (() => void)[] = [];

    getInputItemHtml(value?: string) {
        return `<input name="name[]" class="js-name-inp" ${value ? `value="${value}"` : ''} />`;
    }

    render(props) {
        const root = document.createElement('main');

        const savedNames = props.ctx.state.names;
        const items = savedNames
            ? savedNames.map(name => `<li>${this.getInputItemHtml(name)}</li>`).join('')
            : `<li>${this.getInputItemHtml()}</li>`;

        root.innerHTML = `
            <h1><span>Standup Order</span></h1>
            <p>Do you ever have an awkward silence on your stand up call? Well no more!! With this deterministic tool you'll get a new order for your scrum every day!!!</p>
            <form class="js-form" method="GET" action="/order">
                <ol class="input-list js-input-list">
                    ${items}
                </ol>
                <button><span>Go</span></button>
            </form>
        `;

        return root;
    }

    mounted(root: HTMLElement, props: ViewProps) {
        let last = this.findLast(root);

        if (last) {
            if (last.value) {
                this.appendInput(root);
            } else {
                this.addInputListener(root, last);
            }
        }

        root.querySelector('.js-form')
            .addEventListener('submit', (e) => {
                e.preventDefault();
                const names = this.getNames();

                props.ctx.state.names = names;
                props.ctx.save();
                page(`/order?${this.getQuery(names)}`);
            });
    }

    getNames() {
        const names: string[] = [];

        for (const inp of document.body.querySelectorAll('.js-name-inp')) {
            if (inp instanceof HTMLInputElement && inp.value) {
                names.push(inp.value);
            }
        }

        return names;
    }

    getQuery(names: string[]) {
        let query = [];

        for (const name of names) {
            query.push(encodeURIComponent('name[]') + '=' + encodeURIComponent(name));
        }

        return query.join('&');
    }

    addInputListener(root: HTMLElement, element: HTMLInputElement) {
        const removeListener = () => {
            this.unremovedListeners = this.unremovedListeners.filter(fn => fn !== removeListener);
            element.removeEventListener('input', onInput);
        };

        const onInput = () => {
            this.appendInput(root);
            removeListener();
        };

        this.unremovedListeners.push(removeListener);
        element.addEventListener('input', onInput);
    }

    findLast(root: HTMLElement) {
        const last: Element = root.querySelectorAll('input.js-name-inp')[0];

        if (last instanceof HTMLInputElement) {
            return last;
        }
    }

    appendInput(root: HTMLElement) {
        const li = document.createElement('li');
        li.innerHTML = this.getInputItemHtml();
        root.querySelector('.js-input-list').appendChild(li);
        this.addInputListener(root, li.querySelector('input.js-name-inp'));
    }

    willUnmount() {
        for (const fn of this.unremovedListeners) {
            fn();
        }
    }
}