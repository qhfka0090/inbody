import { useState, useRef, useEffect } from 'react';
/* import * as Chart from 'chart.js'; 아래꺼 축약 */
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title
);
/* import * as Chart from 'chart.js'; 이걸로 쓰면 아래거처럼 불러와야함.
Chart.Chart.register( Chart.RadialLinearScale, ... )
*/

function App(){
  const measurementFields = [
    {id:'weight', label:'체중', unit:'Weight', unitSymbol:'kg', step:0.1, range:'44.0 - 100.0 kg'},
    {id:'bodyFat', label:'체지방률', unit:'Body Fat Percentage', unitSymbol:'%', step:0.1, range:'15.0 - 30.0 %'},
    {id:'muscleMass', label:'근육량', unit:'MuscleMass', unitSymbol:'%', step:0.1, range:'25.0 - 40.0 kg'},
    {id:'waterContent', label:'체수분', unit:'Body Water', unitSymbol:'%', step:0.1, range:'55.0 - 75.0 %'},
    {id:'bmr', label:'기초대사량', unit:'Basal Metabolic Rate', unitSymbol:'kcal', step:1, range:'1500 - 3000 kcal'},
    {id:'bodyAge', label:'신체나이', unit:'Body Age', unitSymbol:'세', step:1, range:'20 - 60 years'}
  ];
  const [ formData, setFormData ] = useState({
    weight:0, bodyFat:0, muscleMass:0, waterContent:0, bmr:0, bodyAge:0
  });

  const [ newChartData, setNewChartData ] = useState({
    weight:0, bodyFat:0, muscleMass:0, waterContent:0, bmr:0, bodyAge:0
  })

  /* const [ chartKey, setChartKey ] = useState(0); */

  const standardValues = {
    weight:52, bodyFat:20, muscleMass:30, waterContent:60, bmr:1500, bodyAge:25
  };

  const inputChange = (name, value) => { 
    setFormData( prevData => ({ /* prev => */ 
      ...prevData,
      [name]:parseFloat(value) || 0 /* 기존데이터에서 이름과 벨류를 받아서 쓰겠다 */
    }));
  };

  const updateChart = () => {
    setNewChartData(formData);
    /* setChartKey(prev=>prev+1); */
  }

  const chartData = {
    labels:['Body Weight','Body Fat','Muscle Mass','Body Water','bmr','Body Age'],
    datasets:[
      {
        label:'측정 결과(% of standard)',
        data:[
          (newChartData.weight/standardValues.weight)*100,
          (newChartData.bodyFat/standardValues.bodyFat)*100,
          (newChartData.muscleMass/standardValues.muscleMass)*100,
          (newChartData.waterContent/standardValues.waterContent)*100,
          (newChartData.bmr/standardValues.bmr)*100,
          (newChartData.bodyAge/standardValues.bodyAge)*100
        ],
        fill:true,
        backgroundColor:'rgba(36,100,236,0.2)',
        borderColor:'rgba(36,100,236,0.8)',
        pointBackgroundColor:'rgba(36,100,236,1)',
        pointBorderColor:'#fff',
        pointHoverBackgroundColor:'#fff',
        pointHoverBorderColor:'rgba(36,100,236,1)',
        borderWidth:2,
        pointRadius:4
      },
      {
        label:'기준값',
        data:[100,100,100,100,100,100],
        fill:true,
        backgroundColor:'rgba(232,214,226,0.1)',
        borderColor:'rgba(204,212,226,0.8)',
        pointBackgroundColor:'rgba(204,212,226,1)',
        borderWidth:1,
        pointRadius:0
      }
    ]
  };

  const chartOptions = {
    scales:{
      r:{
        angleLines:{ color:'rgba(203,213,225,0.3)'},
        grid:{ color:'rgba(203,213,225,0.3)'},
        pointLabels:{
          font:{ family:"'Inter',sans-serif", size:12 },
          color:'rgb(51,65,85)',
        },
        suggestedMin:0,
        suggestedMax:150,
        ticks:{/* 눈금 */
          stepSize:30,
          color:'rgba(100,116,140,1)',
          font:{ size:10 }
        }
      }
    },
    plugins:{
      legend:{
        labels:{
          font:{ family:"'inter',sans-serif" }
        }
      }
    },
    elements:{ /* 곡률 - 날카로운 모서리부분 부드럽게 해주는 0 ~ 1 사이 */
      line:{
        tension:0.1
      }
    }
  };


  return(
    <div className='flex w-full min-h-screen bg-slate-50 p-6'>
      <div className='w-80 p-6 bg-white shadow-lg border-r border-slate-200 rounded-2xl'>
        <div className='mb-6'>
          <h1 className='text-xl font-bold text-slate-800'>InBody Analytics</h1>
          <p className='text-sm text-slate-500 mt-1'>체성분 측정</p>
        </div>
        <div className='flex flex-col gap-5'>
          {
            measurementFields.map((field,idx)=>(
              <div key={field.id} className=''>
                <div className='flex justify-between items-center'>
                  <label className='text-sm font-medium text-slate-700'>{field.label}</label>
                  <span className='text-xs text-slate-400'>{field.unit}</span>
                </div>
                <div className='relative'>
                  <input type='number'
                        step={field.step}
                        value={formData[field.id]}
                        onChange={(e)=>{ inputChange(field.id, e.target.value) }}
                        className='w-full p-2.5 bg-slate-50 border-slate-200 rounded-lg text-slate-800 text-right pr-10 focus:outline-none focus:border-blue-500 focus:shadow-sm focus:shadow-blue-200'
                  />
                  <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm'>
                    { field.unitSymbol }
                  </span>
                </div>
                <div className='text-xs text-slate-400 italic'>
                  기준범위 : {field.range}
                </div>
              </div>
            ))
          }
        </div>
        <button onClick={updateChart}
          className='w-full mt-6 p-3 flex item-center justify-center text-white font-medium rounded-lg bg-blue-500 hover:bg-blue-700 shadow-md transition-all duration-200'>
          <span>분석 결과 업데이트</span>
        </button>
      </div>
      <div className='flex-1 pl-6'>
          <div className='bg-white p-6 rounded-xl shadow-md h-full'>
            <div className='mb-4'>
              <h2 className='text-lg font-semibold text-slate-800'>체성분 분석 결과</h2>
              <p className='text-sm text-slate-500'>Data Analytics Result</p>
            </div>
            <div className='w-full max-w-2xl mx-auto'>
              <Radar data={chartData} options={chartOptions} />
            </div>
          </div>
      </div>
    </div>
  )
}

export default App;
