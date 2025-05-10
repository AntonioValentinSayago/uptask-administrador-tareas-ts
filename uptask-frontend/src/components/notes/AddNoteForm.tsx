import { useForm } from "react-hook-form"
import { NoteFormData } from "../../types"
import ErrorMessage from "../ErrorMessage"

export default function AddNoteForm() {

    const initialValues: NoteFormData = {
        content: ''
    }

    const handleAddNote = (formData: NoteFormData) => {

    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    return (
        <form
            onSubmit={handleSubmit(handleAddNote)}
            className="space-y-3"
            noValidate
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="content">Crear Nota</label>
                <input
                    id="content"
                    type="text"
                    placeholder="Contenido de la nota"
                    className="w-full p-3 border border-gray-300"
                    {...register('content', {
                        required: 'El Contenido de la nota es obligatorio'
                    })}
                />
                {errors.content && (
                    <ErrorMessage>{errors.content.message}</ErrorMessage>
                )}
            </div>
            <input
                type="submit"
                value='Crear Nota'
                className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer"
            />
        </form>
    )
}
