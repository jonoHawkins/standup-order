import IndexPage from "./view/IndexPage";
import ViewManager from "./view/ViewManager";
import OrderPage from "./view/OrderPage";
import page from 'page';

const view = new ViewManager(document.querySelector('.js-root'));

view
    .add('index', new IndexPage())
    .add('order', new OrderPage());

page('/', (ctx) => view.render('index', { ctx }));
page('/order', (ctx) => {
    const params = new URLSearchParams(ctx.querystring);

    view.render('order', {
        ctx,
        names: params.getAll('name[]').filter(Boolean),
    });
});
page();