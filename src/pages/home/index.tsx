import Container from "../../components/container";

export function Home() {
  return (
    <>
      <Container>
        <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center gap-2">
          <input
            type="text"
            placeholder="Digite o nome do carro..."
            className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          />

          <button className="bg-red-500 rounded-lg h-9 px-8 text-white font-medium">
            Buscar
          </button>
        </section>

        <h1 className="font-bold text-center mt-6 text-2xl mb-4">
          Carros novos e usados
        </h1>

        <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <section className="w-full bg-white rounded-lg">
            <img
              className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
              src="https://tse2.mm.bing.net/th?id=OIP.kUe4zpUu2NXHvGerCSC7NAHaEc&pid=Api&P=0&h=180"
              alt="imagem"
            />
            <p className="font-bold mt-1 mb-2 px-2"> Modelo</p>
            <div className="flex flex-col px-2 ">
              <span className="text-zinc-700 mb-6"> Ano | km rodado</span>
              <strong className="text-black font-medium">
                {" "}
                Preço do carro{" "}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2" />
            <div className="px-2 pb-2">
              <span className="text-zinc-700"> Cidade da venda</span>
            </div>
          </section>
        </main>
      </Container>
    </>
  );
}
