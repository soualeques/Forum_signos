// Cache dos elementos do DOM
const btnEnviar = document.getElementById("btnEnviar");
const btnCancelar = document.getElementById("btnCancelar");
const txtData = document.getElementById("txtData");
const divSigno = document.getElementById("divSigno");

// Função para validar a data
function validarData(data) {
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    return regexData.test(data);
}

// Função para buscar os dados do signo
function buscarDadosSigno(data) {
    return new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this);
            } else if (this.readyState == 4) {
                reject('Não foi possível buscar os dados do signo.');
            }
        };

        xmlhttp.open("GET", "signos.xml", true);
        xmlhttp.send();
    });
}

// Função para exibir os dados do signo
function exibirDadosSigno(xml) {
    const xmlDoc = xml.responseXML;
    const x = xmlDoc.getElementsByTagName("signo");
    let conteudo = "";
    const dataValor = txtData.value.slice(5);
    const data = new Date(dataValor);

    for (let i = 0; i < x.length; i++) {
        const dataInicioValor = x[i].getElementsByTagName("dataInicio")[0].childNodes[0].nodeValue;
        const dataFimValor = x[i].getElementsByTagName("dataFim")[0].childNodes[0].nodeValue;
        const [diaInicio, mesInicio] = dataInicioValor.split("/");
        const [diaFim, mesFim] = dataFimValor.split("/");
        const dataInicio = new Date(mesInicio + "-" + diaInicio);
        const dataFim = new Date(mesFim + "-" + diaFim);

        if (data.getTime() >= dataInicio.getTime() && data.getTime() <= dataFim.getTime()) {
            conteudo = `<h2>Você é de ${x[i].getElementsByTagName("signoNome")[0].childNodes[0].nodeValue}</h2>`;
            conteudo += "<div>";
            conteudo += `<p>${x[i].getElementsByTagName("descricao")[0].childNodes[0].nodeValue}</p>`;
            conteudo += ` <img src='${x[i].getElementsByTagName("imagem")[0].childNodes[0].nodeValue}' alt='${x[i].getElementsByTagName("signoNome")[0].childNodes[0].nodeValue}' />`;
            conteudo += "</div>";
            break;
        }
    }

    divSigno.innerHTML = conteudo;
}

// Função para lidar com o evento de clique do botão "Enviar"
async function handleEnviarClick(e) {
    e.preventDefault();

    if (!validarData(txtData.value)) {
        alert("Data inválida!!!... Informe uma data válida!");
        return;
    }

    try {
        const xml = await buscarDadosSigno();
        exibirDadosSigno(xml);
    } catch (error) {
        alert('Erro: ' + error);
    }
}

// Event listeners
btnEnviar.addEventListener("click", handleEnviarClick);

btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    txtData.value = "";
    divSigno.innerHTML = "";
});