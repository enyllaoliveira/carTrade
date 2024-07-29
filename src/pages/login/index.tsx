import Container from "../../components/container";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .email("Insira um e-mail válido")
    .nonempty("O e-mail é obrigatório"),
  password: z.string().nonempty("O campo é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout(){
      await signOut(auth)
    }
    handleLogout()
  }, [])

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password)
    .then((user) => {
      console.log("Login realizado com sucesso")
      console.log(user)
       navigate('/dashboard', { replace: true })
    }).catch(err => {
      console.log('Erro ao realizar login', err)
    })
  }
  return (
    <>
      <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          <Link to="/" className="mb-6 max-w-sm w-full">
            <img src={logo} alt="logo do site" />
          </Link>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white max-w-xl w-full rounded-lg p-4"
          >
            <div className="mb-3">
              <Input
                type="email"
                placeholder="Digite seu e-mail..."
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>
            <div className="mb-3">
              <Input
                type="password"
                placeholder="Digite sua senha..."
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>
            <button
              type="submit"
              className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
            >
              {" "}
              Acessar
            </button>
          </form>
          <p className="text-zinc-800">
            {" "}
            Não possui uma conta?{" "}
            <Link className="underline text-zinc-700" to="/register">
              {" "}
              Cadastre-se
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
