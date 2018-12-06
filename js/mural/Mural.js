const Mural = (function (_render, Filtro) {
    "use strict"

    let cartoes = pegaCartaoUsuario();

    cartoes.forEach(cartao => {
        preparaCartoes(cartao);
    })

    function pegaCartaoUsuario() {
        let cartoesLocal = JSON.parse(localStorage.getItem(usuario));
        if (cartoesLocal) {
            return cartoesLocal.map(cartalLocal => new Cartao(cartalLocal.conteudo, cartalLocal.tipo));
        } else {
            return [];
        }
    }

    function preparaCartoes(cartao) {
        const urlImagens = Cartao.pegaImagens(cartao);

        urlImagens.forEach(url => {
            fetch(url).then(result => {
                caches.open('ceep-imagens')
                    .then(cache => {
                        cache.put(url, result);
                    })
            })
        })

        cartao.on("mudanca.**", salvaCartoes)
        cartao.on("remocao", () => {
            cartoes = cartoes.slice(0)
            cartoes.splice(cartoes.indexOf(cartao), 1)
            salvaCartoes();
            render()
        })
    }

    const render = () => _render({ cartoes: cartoes, filtro: Filtro.tagsETexto });
    render();

    Filtro.on("filtrado", render)

    function salvaCartoes() {
        usuario;
        localStorage.setItem(usuario, JSON.stringify(
            cartoes.map(cartao => ({ conteudo: cartao.conteudo, tipo: cartao.tipo }))));
    }

    login.on("login", () => {
        cartoes = pegaCartaoUsuario();
        render();
    });

    login.on("logout", () => {
        cartoes = [];
        render();
    });

    function adiciona(cartao) {
        if (logado) {
            cartoes.push(cartao)
            salvaCartoes();
            cartao.on("mudanca.**", render)
            preparaCartoes(cartao);
            render()
            return true
        } else {
            alert("Você não está logado");
        }
    }

    return Object.seal({
        adiciona
    })

})(Mural_render, Filtro)
