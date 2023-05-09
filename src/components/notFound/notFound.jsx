import logo from '../../assets/imgs/logoPrefeitura.png'



export function NotFound() {

    return (
        <div className='relative mt-[-25%]'>
            <div className='absolute inset-0 shadow-2xl z-[401] bg-white h-[230px] w-[85%] rounded-md mx-auto p-4 flex flex-col justify-center content-center'>
             
                 
                <p className='text-center'>Não foi possível encontrar esse ponto. Tente buscar por outro termo na tela inicial.</p>
                 <a href="/" className='underline text-center mt-4'>Voltar</a>
                
         </div>
        </div>
     
    )
}