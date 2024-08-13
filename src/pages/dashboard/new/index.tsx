import Container from "../../../components/container";
import { DashboardHeader } from "../../../components/painelHeader";
import { FiUpload, FiTrash } from "react-icons/fi";
import { useForm } from "react-hook-form";
import Input from "../../../components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { storage } from "../../../services/firebaseConnection";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

interface ImageItemsProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}
const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano é obrigatório"),
  km: z.string().nonempty("O KM do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsApp: z
    .string()
    .min(1, " O telefone é obrigatório")
    .refine((value) => /^(\d{10,12})$/.test(value), {
      message: "Número de telefone é inválido.",
    }),
  description: z.string().nonempty("A descrição é obrigatória"),
});
type FormData = z.infer<typeof schema>;

export function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [carImages, setCarImages] = useState<ImageItemsProps[]>([]);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        // enviar ao back
        await handleUpload(image);
      } else {
        alert("Formato de imagem inválido. Use JPG ou PNG.");
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downLoadUrl) => {
        const imageItem = {
          name: uidImage,
          uid: currentUid,
          previewUrl: URL.createObjectURL(image),
          url: downLoadUrl,
        };
        setCarImages((images) => [...images, imageItem]);
      });
    });
  }

  function onSubmit(data: FormData) {
    console.log(data);
  }
  return (
    <>
      <Container>
        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
          <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48 relative">
            <div className="flex items-center justify-center">
              <FiUpload size={30} color="#000" />
              <input
                type="file"
                accept="image/"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFile}
              />
            </div>
          </button>

          {carImages.map((image) => (
            <div
              key={image.name}
              className="w-full h-32 flex items-center justify-center relative"
            >
              <button
                onClick={() => {
                  setCarImages((images) =>
                    images.filter((img) => img.name !== image.name)
                  );
                  deleteObject(
                    ref(storage, `images/${image.uid}/${image.name}`)
                  );
                }}
                className="absolute "
              >
                <FiTrash size={30} color="#black" />
              </button>
              <img
                src={image.previewUrl}
                className="rounded-lg w-full h-32 object-cover"
                alt={image.name}
              />
            </div>
          ))}
        </div>

        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <p className="mb-2 font-medium"> Nome do carro</p>
              <Input
                type="text"
                register={register}
                name="name"
                error={errors.name?.message}
                placeholder="Ex: Onix 1.0..."
              />
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium"> Modelo do carro</p>
              <Input
                type="text"
                register={register}
                name="model"
                error={errors.model?.message}
                placeholder="Ex: 1.0 Flex Plux Manual"
              />
            </div>
            <div className="flex w-full mb-3 flex-row items-center gap-4">
              <div className="w-full">
                <p className="mb-2 font-medium"> Ano</p>
                <Input
                  type="text"
                  register={register}
                  name="year"
                  error={errors.year?.message}
                  placeholder="Ex: 2016/2016..."
                />
              </div>
              <div className="w-full">
                <p className="mb-2 font-medium"> KM rodado</p>
                <Input
                  type="text"
                  register={register}
                  name="km"
                  error={errors.km?.message}
                  placeholder="Ex: 23.900..."
                />
              </div>
            </div>
            <div className="flex w-full mb-3 flex-row items-center gap-4">
              <div className="w-full">
                <p className="mb-2 font-medium"> Telefone/Whatsapp</p>
                <Input
                  type="text"
                  register={register}
                  name="whatsApp"
                  error={errors.whatsApp?.message}
                  placeholder="Ex: 011999999999..."
                />
              </div>
              <div className="w-full">
                <p className="mb-2 font-medium"> Cidade</p>
                <Input
                  type="text"
                  register={register}
                  name="city"
                  error={errors.city?.message}
                  placeholder="Ex: Brasília - DF..."
                />
              </div>
            </div>
            <div className="mb-3">
              <p className="mb-2 font-medium"> Preço</p>
              <Input
                type="text"
                register={register}
                name="price"
                error={errors.price?.message}
                placeholder="Ex: R$50.000,00..."
              />
              <div className="mb-3">
                <p className="mb-2 font-medium"> Descrição</p>
                <textarea
                  className="border-b w-full rounded-md h-24 px-2"
                  {...register("description")}
                  name="description"
                  id="description"
                  placeholder="Descreva detalhadamente o carro..."
                />
                {errors.description && (
                  <p className="mb-1 text-red-500">
                    {" "}
                    {errors.description.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
        <DashboardHeader />
      </Container>
    </>
  );
}
