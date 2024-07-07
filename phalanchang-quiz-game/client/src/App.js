// import React from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// ■ データ登録テスト用
// function App() {
//   const handleInsertRecord = () => {
//     axios.post('http://localhost:5000/api/insert', { name: 'Sample Name' })
//       .then(response => {
//         alert('Record inserted successfully');
//       })
//       .catch(error => {
//         console.error('There was an error inserting the record!', error);
//         alert('Error inserting record');
//       });
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Insert Record Test</h1>
//         <button onClick={handleInsertRecord}>Insert Record</button>
//       </header>
//     </div>
//   );
// }


// function App() {
//     return (
//       <div className="app-container">
//         <div className="top-bar">Knowledge 登録</div>
//         <div className="container">
//           <div className="input-area">
//             <h2>Knowledge 登録</h2>
//             <input type="text" placeholder="Knowledge Title" />
//             <div className="input-group">
//               <label>Knowledge</label>
//               <textarea placeholder="Knowledge" />
//             </div>
//             <div className="input-group">
//               <label>Topic</label>
//               <select>
//                 <option value="">Select Topic</option>
//                 {/* ここに他のトピックオプションを追加 */}
//                 <option value="topic1">Topic 1</option>
//                 <option value="topic2">Topic 2</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Source</label>
//               <select>
//                 <option value="">Select Source</option>
//                 {/* ここに他のソースオプションを追加 */}
//                 <option value="source1">Source 1</option>
//                 <option value="source2">Source 2</option>
//               </select>
//             </div>
//             <div className="input-group">
//               <label>Note</label>
//               <select>
//                 <option value="">Select Note</option>
//                 {/* ここに他のノートオプションを追加 */}
//                 <option value="note1">Note 1</option>
//                 <option value="note2">Note 2</option>
//               </select>
//             </div>
//           </div>
//           <div className="list-area">
//             <h2>Knowledge 一覧</h2>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Knowledge</th>
//                   <th>Date</th>
//                   <th>Topic</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>Sample Title</td>
//                   <td>Sample Knowledge</td>
//                   <td>2024-05-27</td>
//                   <td>Sample Topic</td>
//                   <td>
//                     <button>Edit</button>
//                     <button>Delete</button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
function App() {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [formData, setFormData] = useState({
    knowledge_title: '',
    knowledge_detail: '',
    knowledge_creator: '',
    status: 'active',
    tags: '',
    views: 0,
    rating: 0
  });

  /* 初期表示 */
  useEffect(() => {
    axios.get('http://localhost:5000/api/list-knowledge')
      .then(response => {
        setKnowledgeData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  /* アコーディオン */
  const toggleAccordion = (event) => {
    event.preventDefault();
    setIsAccordionOpen(!isAccordionOpen);
  };

  /* 登録 */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    /* 登録 */
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/add-knowledge', formData)
      .then(response => {
        console.log(response.data);
        // 再度データを取得してリストを更新
        axios.get('http://localhost:5000/api/list-knowledge')
          .then(response => {
            setKnowledgeData(response.data);
          });
      })
      .catch(error => {
        console.error("There was an error posting the data!", error);
      });
  };

  return (
    <div className="app-container">
      <Header />
      <div className="container">
        <div className="main-content">
          <div className="input-area">
            <form onSubmit={handleSubmit}>
              <div className="register-container">
                <h2>Knowledge 登録</h2>
                <button className="accordion-button" onClick={toggleAccordion}>
                  {isAccordionOpen ? '閉' : '開'}
                </button>
                <button className="register-button" type="submit">登録</button>
              </div>
              {isAccordionOpen && (
                <div className="accordion-content">
                  <div className="input-group">
                    <label>Title</label>
                    <input type="text" name="knowledge_title" placeholder="Knowledge Title" value={formData.knowledge_title} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Knowledge</label>
                    <textarea name="knowledge_detail" placeholder="Knowledge" value={formData.knowledge_detail} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Creator</label>
                    <input type="text" name="knowledge_creator" placeholder="Creator" value={formData.knowledge_creator} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Tags</label>
                    <input type="text" name="tags" placeholder="Tags" value={formData.tags} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Views</label>
                    <input type="number" name="views" placeholder="Views" value={formData.views} onChange={handleChange} />
                  </div>
                  <div className="input-group">
                    <label>Rating</label>
                    <input type="number" step="0.1" name="rating" placeholder="Rating" value={formData.rating} onChange={handleChange} />
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="list-area">
            <h2>Knowledge 一覧</h2>
            {knowledgeData.map((item, index) => (
              <div key={index} className="card">
                <div className="card-title">{item.knowledge_title}</div>
                <div className="card-details">{item.knowledge_detail}</div>
                <div className="card-details">{item.knowledge_creation_date}</div>
                <div className="card-details">{item.knowledge_creator}</div>
                <div className="card-actions">
                  <button>Edit</button>
                  <button>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;