import View, { ViewProps } from "./AbstractView";
import seedrandom from 'seedrandom';

export interface OrderPageProps extends ViewProps {
    names: string[]
}

export default class OrderPage extends View<OrderPageProps> {
    sortNames(names: string[]) {
        const freshClone = [...names];
        freshClone.sort();

        const date = new Date();
        const seed = [
            date.getFullYear(),
            date.getMonth(),
            date.getDay(),
            ...names,
        ].join('');

        const rng = seedrandom(seed);
        const sorted = [];

        for (const name of freshClone) {
            sorted.push({ i: rng(), name });
        }

        sorted.sort((a, b) => a.i - b.i);

        return sorted.map(e => e.name);
    }

    render(props: OrderPageProps) {
        const root = document.createElement('main');
        const { names } = props;

        const content = names && names.length
            ? `<ol class="order-list">
                ${this.sortNames(names).map(name => `<li>${name}</li>`).join('')}
            </ol>`
            : `<p>Looks like you didn't set any names 😬</p>`

        root.innerHTML = `
            <h1><span>Today's Order!</span></h1>
            ${content}
            <nav><a href="/">Back</a></nav>
        `;

        return root;
    }
}