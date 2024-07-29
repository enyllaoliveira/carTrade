import Container from "../../components/container";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().nonempty("O campo é obrigatório"),
  email: z
    .string()
    .email("Insira um e-mail válido")
    .nonempty("O e-mail é obrigatório"),
  password: z
    .string()
    .min(6, "A senha deve ter ao menos 6 caracteres")
    .nonempty("O campo é obrigatório"),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password).then(
     async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });
        console.log("usuário cadastrado com sucesso")
        navigate('/dashboard', {
          replace: true,
        })
      }
    ).catch((error) => {
      console.log('Erro ao realizar cadastro', error)
    })
  }

  useEffect(() => {
    async function handleLogout(){
      await signOut(auth)
    }
    handleLogout()
  }, [])

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
                type="text"
                placeholder="Digite seu nome completo..."
                name="name"
                error={errors.name?.message}
                register={register}
              />
            </div>
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
              Cadastrar
            </button>
          </form>
          <p className="text-zinc-800">
            {" "}
            Já possui uma conta? Faça seu{" "}
            <Link className="underline text-zinc-700" to="/login">
              {" "}
              login
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
}
