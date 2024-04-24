import { useState, useEffect } from 'react'; // Importa useState y useEffect de React
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'; // Importa QueryClient, QueryClientProvider y useQuery de react-query
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import pattern from "./images/pattern-divider-mobile.svg"
import dice from "./images/icon-dice.svg"
import './App.css'

async function fetchAdvice() {
  const response = await fetch('https://api.adviceslip.com/advice');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

const queryClient = new QueryClient();

function AdviseSection() {
  const [advice, setAdvice] = useState(() => {
    const savedAdvice = localStorage.getItem('advice');
    return savedAdvice ? JSON.parse(savedAdvice) : null;
  });

  const { data, status } = useQuery('advice', fetchAdvice, {
    onSuccess: (data) => {
      setAdvice(data.slip);
    },
  });

  useEffect(() => {
    if (advice) {
      localStorage.setItem('advice', JSON.stringify(advice));
    }
  }, [advice]);

  const refreshAdvice = () => {
    queryClient.invalidateQueries('advice');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error al cargar los datos</div>;
  }

  return (
    <>
    <section className='advise-section'>
      <div className='advise-section-container'>
        <span className='advise-section-container-advice'>advise#{advice.id}</span>
        <h1 className='advise-section-container-advice-h1'>{advice.advice}</h1>
        <img src={pattern} alt="" className='advise-section-container-advice-pattern' />
        <div className='dice-container' onClick={refreshAdvice}>
          <img src={dice} alt=""  className='advise-section-container-advice-dice'/>
        </div>
      </div>
    </section>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdviseSection />
      {/* Aquí puedes poner otros componentes de tu aplicación */}
    </QueryClientProvider>
  );
}

export default App;




