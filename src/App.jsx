import React, { useState, useEffect } from 'react'
import  Axios  from 'axios';
import { FaVolumeUp } from 'react-icons/fa';

export default function  App() {

const [word, setWord] = useState("");
const [search, setSearch] = useState(null);
const [suggestions, setSuggestions] = useState([]);



const fetchWord = ()=>{
  Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((res)=>{
        setSearch(res.data[0]);  
        console.log(res.data)
  });
};

useEffect(()=>{
  fetchWord();
}, []);



const audioUrl = search?.phonetics?.find(p => p.audio)?.audio;



  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await Axios.get(`https://api.datamuse.com/sug?s=${input}`);
      setSuggestions(res.data.slice(0, 5)); // limit suggestions
    } catch (error) {
      console.error("Suggestion fetch failed:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setWord(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestedWord) => {
    setWord(suggestedWord);
    setSuggestions([]);
    // Optional: trigger search here if needed
  };



  return (


    <div>
      <h1 className='font-bold p-5 text-xl'>Geesoft Dictionary</h1>

      <div className=''>
        <div className='flex justify-center'>
            <input
      value={word}
      type='text'
      className='border w-3xl h-14 p-2  text-2xl rounded-l'
      placeholder='Search Dictionary'
        onChange={handleChange}
      // onChange={(event)=>{
      //   setWord(event.target.value);
       
      // }}
      />


      <button className='border w-[70px] rounded-r  h-14 ' onClick={fetchWord}>
      Search  
      </button>
   

     
      


 
        </div>
        <div className='justify-center p-2 w-4xl mx-auto'>
        {suggestions.length > 0 && (
        <ul className="rounded mt-2 bg-white shadow">
          {suggestions.map((item) => (
            <li
              key={item.word}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(item.word)}
            >
              {item.word}
            </li>
          ))}
        </ul>
      )}
       </div>
      </div>
  

    


      <div> 
        <h1 className='text-5xl text-red-400 font-bold pl-10 pt-10'>{search?.word}</h1>

        <div className='flex pl-10 pt-5  '>
           <h1 className='text-xl text-black font-semibold  bg-gray-200 p-3 rounded border-gray-100'>{search?.phonetic}</h1>

           <div className='pl-5'>

<button  onClick={() => new Audio(audioUrl).play()} disabled={!audioUrl}>
  <FaVolumeUp className='cursor-pointer ' size={24} />
</button>


           </div>
        </div>
   

   {search?.meanings?.map((meaning, index) => (
  <div key={index} className="mb-4  pl-10 pt-5">
    <h2 className="font-semibold text-2xl capitalize">{meaning.partOfSpeech}</h2>

    {meaning.definitions.map((def, i) => (
      <div key={i} className="ml-4 mb-2">
        <p>- {def.definition}</p>
        {def.example && <p className="text-sm italic">Example: "{def.example}"</p>}
      </div>
    ))}
  </div>
))}
     
      </div>  
    </div>
  )
}
