// App completo com todos os containers, campos de valor/quantidade, remoção e envio via POST
import React, { useState, useEffect } from "react";
import axios from "axios";

const Logo = () => (
  <svg
    width="76"
    height="76"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mb-0 ml-2"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.00684 15.3118C4.17043 18.6186 7.0241 21.1548 10.3301 21.1548L16.3375 21.1495V19.2022C16.3375 18.3553 15.6507 17.6625 14.7987 17.6625L10.1498 17.6677C8.56729 17.6677 7.30142 16.2767 7.50875 14.6504C7.68284 13.3085 8.8901 12.3383 10.2426 12.3383H11.8802V8.85124H10.1507C6.6593 8.85124 3.83274 11.781 4.00771 15.3118H4.00684Z"
      fill="#E9E9E9"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M33.9923 14.6898C33.8296 11.3891 30.975 8.85208 27.6691 8.85208H21.6617V10.7994C21.6617 11.6515 22.3545 12.3391 23.2013 12.3391H27.8493C29.4318 12.3391 30.6977 13.7301 30.4904 15.3503C30.3163 16.6931 29.109 17.6633 27.7557 17.6633H26.1259V21.1556H27.8493C31.3416 21.1556 34.1673 18.2258 33.9923 14.6898Z"
      fill="#E9E9E9"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.6881 0.0076354C15.3822 0.172102 12.8452 3.0249 12.8452 6.33174L12.8504 12.3392H14.7978C15.6446 12.3392 16.3366 11.6463 16.3366 10.7995L16.3314 6.15152C16.3314 4.56897 17.7223 3.3031 19.3486 3.5113C20.6906 3.68539 21.6617 4.89178 21.6617 6.24513V7.87667H25.1487V6.15152C25.1487 2.65923 22.2198 -0.166455 18.6881 0.0076354Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.311 29.9957C22.617 29.8303 25.154 26.9828 25.154 23.6707L25.1487 17.6633H23.2014C22.3493 17.6633 21.6617 18.3561 21.6617 19.2082V23.8518C21.6617 25.4343 20.2759 26.6993 18.6505 26.4938C17.3085 26.324 16.3375 25.1115 16.3375 23.7599V22.1284H12.8513V23.8518C12.8513 27.3493 15.775 30.1706 19.3119 29.9965L19.311 29.9957Z"
      fill="white"
    />
  </svg>
);

export default function App() {
  const [termoBusca, setTermoBusca] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const buscar = async () => {
      if (termoBusca.trim() === "") {
        setProdutosFiltrados([]);
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:4040/api/products/search/getByName?nome=${encodeURIComponent(termoBusca)}`
        );
        setProdutosFiltrados(res.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setMensagem("Erro ao buscar produtos. Tente novamente.");
      }
    };
    const delay = setTimeout(buscar, 400);
    return () => clearTimeout(delay);
  }, [termoBusca]);

  const adicionarProduto = (produto) => {
    const existe = selecionados.some((p) => p.id === produto.id);
    if (!existe) {
      setSelecionados([{ ...produto, quantidade: 1, valor: 0 }, ...selecionados]);
    }
    setTermoBusca("");
    setProdutosFiltrados([]);
  };

  const removerProduto = (id) => {
    setSelecionados(selecionados.filter((p) => p.id !== id));
  };

  const atualizarProduto = (id, campo, valor) => {
    setSelecionados((atual) =>
      atual.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const enviarOrcamento = async () => {
    if (selecionados.length === 0) {
      setMensagem("Nenhum item selecionado.");
      return;
    }
    for (let p of selecionados) {
      if (!p.quantidade || !p.valor) {
        setMensagem(`Preencha quantidade e valor para o item "${p.nome}".`);
        return;
      }
    }
    try {
      setEnviando(true);
      await axios.post("http://localhost:4040/orcamento/", selecionados);
      setMensagem("Orçamento enviado com sucesso!");
      setSelecionados([]);
    } catch (err) {
      console.error(err);
      setMensagem("Erro ao enviar orçamento.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen p-10 overflow-y-auto flex justify-center items-start" style={{ backgroundColor: "#ECF6EC" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />
      <div className="w-full max-w-5xl space-y-6">
        {/* Container 1 original restaurado */}
        <div className="h-72 bg-[#44AA63] rounded-2xl shadow-sm flex justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-white text-6xl leading-tight tracking-wide text-center" style={{ fontFamily: "Bebas Neue, sans-serif" }}>MANUTENÇÃO DE VEÍCULOS</p>
            <div className="flex items-center justify-center space-x-2">
              <p className="text-white text-6xl leading-tight tracking-wide text-center" style={{ fontFamily: "Bebas Neue, sans-serif" }}>TERCEIRIZE</p>
              <Logo />
            </div>
          </div>
        </div>

        {/* Container 2 */}
        <div className="h-52 bg-[#FAFAFA] rounded-2xl shadow-md border-t-[36px] border-[#44AA63] flex flex-col justify-center px-6" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          <div className="text-4xl font-bold text-black">Peças para manutenção de veículos</div>
          <div className="mt-4 text-2xl font-light text-black">Pesquise e selecione abaixo as peças para realizar a manutenção.</div>
        </div>

        {/* Container 3 */}
        <div className="bg-[#FAFAFA] rounded-2xl shadow-md flex flex-col px-6 pt-4 pb-6" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          <input
            type="text"
            placeholder="Pesquisar item"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full px-4 py-3 text-xl font-light italic rounded-lg border-2 border-[#44AA63] focus:outline-none focus:ring-2 focus:ring-[#44AA63]"
          />

          <ul className="mt-2 max-h-48 overflow-y-auto">
            {produtosFiltrados.map((produto) => (
              <li
                key={produto.id}
                onClick={() => adicionarProduto(produto)}
                className="p-2 text-lg text-gray-800 border-b border-gray-300 hover:bg-[#E6F4E6] cursor-pointer"
              >
                <div className="font-semibold">{produto.nome}</div>
                <div className="text-sm text-gray-600">{produto.descricao}</div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 overflow-y-auto max-h-[500px]">
            {selecionados.map((produto) => (
              <div
                key={produto.id}
                className="p-4 bg-white rounded-md shadow border border-gray-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-base text-gray-800 font-semibold">
                      {produto.nome}
                    </span>
                    <div className="text-sm text-gray-600">{produto.descricao}</div>
                  </div>
                  <button onClick={() => removerProduto(produto.id)} className="text-red-600 hover:underline text-sm">Remover</button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade de Unidades
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={produto.quantidade}
                      onChange={(e) => atualizarProduto(produto.id, "quantidade", e.target.value)}
                      placeholder="Ex: 2"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#44AA63] focus:border-[#44AA63]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Unitário (R$)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={produto.valor}
                      onChange={(e) => atualizarProduto(produto.id, "valor", e.target.value)}
                      placeholder="Ex: 45.90"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#44AA63] focus:border-[#44AA63]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Container 4 - mão de obra */}
        <div className="h-52 bg-[#FAFAFA] rounded-2xl shadow-md border-t-[36px] border-[#44AA63] flex flex-col justify-center px-6" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          <div className="text-4xl font-bold text-black">Mão de obra</div>
          <div className="mt-4 text-2xl font-light text-black">Insira abaixo o valor da mão de obra.</div>
        </div>

        {/* Container 5 - outro campo */}
        <div className="h-44 bg-[#FAFAFA] rounded-2xl shadow-md flex flex-col px-6 pt-4" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
          <input
            type="text"
            placeholder="Outro campo de pesquisa"
            className="w-full px-4 py-3 text-xl font-light italic rounded-lg border-2 border-[#44AA63] focus:outline-none focus:ring-2 focus:ring-[#44AA63]"
          />
        </div>

        {/* Botão final */}
        <div className="flex justify-center">
          <button
            onClick={enviarOrcamento}
            disabled={enviando}
            className="w-1/2 py-3 text-xl font-semibold text-white bg-[#44AA63] rounded-lg hover:bg-[#369652] transition-colors"
            style={{ fontFamily: "Nunito Sans, sans-serif" }}
          >
            {enviando ? "Enviando..." : "Enviar orçamento"}
          </button>
        </div>

        {mensagem && (
          <div className="text-center text-lg mt-2 text-[#333]">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}
