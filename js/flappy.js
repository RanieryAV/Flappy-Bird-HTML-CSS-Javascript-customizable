function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`

}

/* const b= new Barreira(false)
b.setAltura(500)
document.querySelector('[wm-flappy]').appendChild(b.elemento) */  



function ParDeBarreiras(altura, abertura, popsicaoNaTela, clientWidth, areaDoJogo) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)
    this.itensPontosAdicionais = new itemPontosAdicionais(Math.random(),Math.random(), clientWidth, areaDoJogo);
    this.itensEspeciais = new itemEspecial(Math.random(),Math.random(), clientWidth, areaDoJogo);

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
    this.elemento.appendChild(this.itensPontosAdicionais.elementoPontosAdd)
    this.elemento.appendChild(this.itensEspeciais.elementoEspecial)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX =  popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()

    if(document.getElementById('gridDistanciaCanos1').checked){//Distância entre os canos: Fácil
        this.setX((popsicaoNaTela*1.5));
    }else if(document.getElementById('gridDistanciaCanos2').checked){//Distância entre os canos: Médio
        this.setX(popsicaoNaTela);
    }else if(document.getElementById('gridDistanciaCanos3').checked){//Distância entre os canos: Difícil
        this.setX((popsicaoNaTela/1.3));
    }
}

class itemPontosAdicionais {
    constructor(altura, abertura, popsicaoNaTela, areaDoJogo) {
        this.elementoPontosAdd = novoElemento('div', 'item-pontos-adicionais')
        this.elementoPontosAdd.setAttribute("src", "/img/pao-de-queijo.png")
        this.elementoPontosAdd.setAttribute("height", "107")
        this.elementoPontosAdd.setAttribute("width", "71")
        
        this.animarItem = () => {
            this.getX = () => parseInt(this.elementoPontosAdd.style.left.split('px')[0])
            this.setX =  posicaoNaTela => this.elementoPontosAdd.style.left = `${posicaoNaTela}px`
            this.getLargura = () => areaDoJogo.clientWidth

            if (this.getX() <= 0) {
                this.setX(0)
            } else if (this.getX() >= this.getLargura()) {
                this.setX(this.getLargura())
            } else {
                this.setX(this.getX())
            }
            

        }
    }
}

class itemEspecial {
    constructor(altura, abertura, popsicaoNaTela, areaDoJogo) {
        this.elementoEspecial = novoElemento('div', 'item-especial')
        this.elementoEspecial.setAttribute("src", "/img/super_star.png")
        this.elementoEspecial.setAttribute("height", "107")
        this.elementoEspecial.setAttribute("width", "114")
        
        this.animarItem = () => {
            this.getX = () => parseInt(this.elementoEspecial.style.left.split('px')[0])
            this.setX =  posicaoNaTela => this.elementoEspecial.style.left = `${posicaoNaTela}px`
            this.getLargura = () => areaDoJogo.clientWidth

            if (this.getX() <= 0) {
                this.setX(0)
            } else if (this.getX() >= this.getLargura()) {
                this.setX(this.getLargura())
            } else {
                this.setX(this.getX())
            }
            

        }
    }
}

/* const b= new ParDeBarreiras(500,300,1000)
document.querySelector('[wm-flappy]').appendChild(b.elemento)  */

function Barreiras(altura, largura, abertura, espaco, notificarPonto, clientWidth, areaDoJogo) {
    if(document.getElementById('gridIntervaloCanos1').checked){//Abertura dos canos: Fácil
        this.pares = [
            new ParDeBarreiras(altura, (abertura*2), largura, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura*2), largura + espaco, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura*2), largura + espaco * 2, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura*2), largura + espaco * 3, clientWidth, areaDoJogo)
        ]
    }else if(document.getElementById('gridIntervaloCanos2').checked){//Abertura dos canos: Média
        this.pares = [
            new ParDeBarreiras(altura, abertura, largura, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, abertura, largura + espaco, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, abertura, largura + espaco * 2, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, abertura, largura + espaco * 3, clientWidth, areaDoJogo)
        ]
    }else if(document.getElementById('gridIntervaloCanos3').checked){//Abertura dos canos: Difícil
        this.pares = [
            new ParDeBarreiras(altura, (abertura/1.3), largura, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura/1.3), largura + espaco, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura/1.3), largura + espaco * 2, clientWidth, areaDoJogo),
            new ParDeBarreiras(altura, (abertura/1.3), largura + espaco * 3, clientWidth, areaDoJogo)
        ]
    }
    //Encadeamento de estruturas if para tratar a entrada da Velocidade da Jogo
    var tempDesloc = parseInt(document.getElementById('inputVelocidadeJogo').value);
    if(isNaN(tempDesloc) || tempDesloc == undefined || tempDesloc == null){
        alert("Erro: Valor inválido (porque não é um número)!");
        document.getElementById('inputVelocidadeJogo').value = "";
        tempDesloc = 0;
        document.location.reload(true);//Recarregar a página para inserir dado correto
    }else{
        if(tempDesloc < 1 || tempDesloc > 10){
            alert("Erro: A Velocidade do jogo deve ser entre 1 e 10!");
            document.getElementById('inputVelocidadeJogo').value = "";
            tempDesloc = 0;
            document.location.reload(true);//Recarregar a página para inserir dado correto
        }else{
            var deslocamento = parseInt(document.getElementById('inputVelocidadeJogo').value);    
        }
    }
    
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouMeio) {
                notificarPonto()
            }
        })
    }
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const areaDoJogo = document.querySelector('[wm-flappy]')

barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
    barreiras.animar()
},20)  */
function definirVelocidadeVoo(valorVoo){//Função que define a velocidade da personagem
    if(document.getElementById('gridVelocidadePersonagem1').checked){
        return (valorVoo ? 2 : -1.6);
    }else if(document.getElementById('gridVelocidadePersonagem2').checked){
        return (valorVoo ? 8 : -5);
    }else if(document.getElementById('gridVelocidadePersonagem3').checked){
        return (valorVoo ? 14 : -8);
    }    
}

function Passaro(alturaJogo) {
    let voando = false
    let opcaoPersonagem = document.getElementById('inputPersonagens').value;

    //Estrutura if para escolher o personagem (ou o Flappy Bird, que é o padrão, ou o PAC-MAN)
    if(opcaoPersonagem == 'Flappy Bird (Padrão)'){
        this.elemento = novoElemento('img', 'passaro')
        this.elemento.src = 'img/passaro.png'
    }else if(opcaoPersonagem == 'PAC-MAN'){
        this.elemento = novoElemento('img', 'passaro')
        this.elemento.src = 'img/pac-man.png'
    }

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + definirVelocidadeVoo(voando);
        const alturaMaxima = alturaJogo - this.elemento.clientWidth

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo / 2)
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
      barreiras.animar()
      passaro.animar() 
},20) */


 function Progresso() {

    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

/*  const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('[wm-flappy]')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))  */


 function estaoSobrepostos(elementoA, elementoB) {

    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false

    if(document.getElementById('gridTipoJogo1').checked){//Modo treino
        return colidiu
    }else if(document.getElementById('gridTipoJogo2').checked){//Modo real (com regras valendo)
        barreiras.pares.forEach(parDeBarreiras => {
            if (!colidiu) {
                const superior = parDeBarreiras.superior.elemento
                const inferior = parDeBarreiras.inferior.elemento
                colidiu = estaoSobrepostos(passaro.elemento, superior)
                    || estaoSobrepostos(passaro.elemento, inferior)
            }
        })
    }
    
    return colidiu

}

function colidiuComItem(passaro, itemPontosAdicionais) {
    let colidiuItem = false

    if(document.getElementById('gridTipoJogo1').checked){//Modo treino
        return colidiuItem
    }else if(document.getElementById('gridTipoJogo2').checked){//Modo real (com regras valendo)
        if (!colidiuItem) {
            colidiuItem = estaoSobrepostos(passaro.elemento, itemPontosAdicionais);
        }
    }
    
    return colidiuItem

}

 function FlappyBird() {
    let pontos = 0
    const areaDoJogo = escolherCenarioJogo();
    
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    const progresso = new Progresso();
    
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => {
            if(document.getElementById('gridPontuacao1').checked){
                progresso.atualizarPontos(++pontos);
            }else if(document.getElementById('gridPontuacao2').checked){
                progresso.atualizarPontos((pontos = pontos + 10));
            }else if(document.getElementById('gridPontuacao3').checked){
                progresso.atualizarPontos((pontos = pontos + 100));
            }
        }, areaDoJogo.clientWidth, areaDoJogo)
            
        

    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
    
    var estadoColisaoItemEsp = false;
    this.start = () => {
        var nomeJogador = document.getElementById('inputNomeJogador').value;
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            if(estaoSobrepostos(passaro.elemento, barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd) || estaoSobrepostos(passaro.elemento, barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd) || estaoSobrepostos(passaro.elemento, barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd) || estaoSobrepostos(passaro.elemento, barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd)){
                if(document.getElementById('gridPontuacao1').checked){
                    progresso.atualizarPontos((pontos = pontos + 2));
                    if(estaoSobrepostos(passaro.elemento, barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }
                    
                }else if(document.getElementById('gridPontuacao2').checked){
                    progresso.atualizarPontos((pontos = pontos + 5));
                    if(estaoSobrepostos(passaro.elemento, barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }
                }else if(document.getElementById('gridPontuacao3').checked){
                    progresso.atualizarPontos((pontos = pontos + 20));
                    if(estaoSobrepostos(passaro.elemento, barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[0].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[1].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[2].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }else if(estaoSobrepostos(passaro.elemento, barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd)){
                        barreiras.pares[3].itensPontosAdicionais.elementoPontosAdd.style.display = 'none';
                    }
                }
            }

            if(estaoSobrepostos(passaro.elemento,barreiras.pares[0].itensEspeciais.elementoEspecial)){
                barreiras.pares[0].itensEspeciais.elementoEspecial.style.display = 'none';
                estadoColisaoItemEsp = true;
            }else if(estaoSobrepostos(passaro.elemento,barreiras.pares[1].itensEspeciais.elementoEspecial)){
                barreiras.pares[1].itensEspeciais.elementoEspecial.style.display = 'none';
                estadoColisaoItemEsp = true;
            }else if(estaoSobrepostos(passaro.elemento,barreiras.pares[2].itensEspeciais.elementoEspecial)){
                barreiras.pares[2].itensEspeciais.elementoEspecial.style.display = 'none';
                estadoColisaoItemEsp = true;
            }else if(estaoSobrepostos(passaro.elemento,barreiras.pares[3].itensEspeciais.elementoEspecial)){
                barreiras.pares[3].itensEspeciais.elementoEspecial.style.display = 'none';
                estadoColisaoItemEsp = true;
            }
              if(colidiu(passaro,barreiras)){
                 if(estadoColisaoItemEsp == false){
                    progresso.atualizarPontos(placarFinal(nomeJogador, pontos)); 
                    clearInterval(temporizador)
                 }else{
                    setTimeout(() => {
                        estadoColisaoItemEsp = false;
                        if(colidiu(passaro,barreiras)){
                            estadoColisaoItemEsp = false;
                            progresso.atualizarPontos(placarFinal(nomeJogador, pontos)); 
                            clearInterval(temporizador)
                        }
                    }, 10000)
                 }
                  
             }
        }, 20)
    }
}
 //new FlappyBird().start() 
 function placarFinal(nomeJogador, pontos){
    return `- Nome: ${nomeJogador}; - Pontos: ${pontos}`; 
 }

 function escolherCenarioJogo(){
    if(document.getElementById("gridCenarioJogo1").checked){
        document.querySelector('[wm-flappy]').style.display = 'none';
        return document.querySelector('[wm-flappy-night]');
    }else if(document.getElementById("gridCenarioJogo2").checked){
        document.querySelector('[wm-flappy-night]').style.display = 'none';
        return document.querySelector('[wm-flappy]');
    }
 }
var janelaConfig = document.getElementsByClassName('form-configuracoes');
var el = document.querySelector('.botao-configuracoes');

el.addEventListener('click', function(){
    var el2 = document.querySelector('.form-configuracoes');
    el2.style.display = "none";
})