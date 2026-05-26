import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle, ChevronRight, FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const StudentSubmit = () => {
  const [formData, setFormData] = useState({ title: '', where: '', description: '', pointsRequested: '' });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a certificate PDF/Image');

    setIsUploading(true);
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('where', formData.where);
    submitData.append('description', formData.description);
    submitData.append('pointsRequested', formData.pointsRequested);
    submitData.append('certificate', file);

    try {
      await api.post('/activities', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/student/history'); // Redirect to history on success
    } catch (err) {
      console.error(err);
      alert('Error submitting activity');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-xl"><FileUp size={24}/></div>
          Submit New Activity
        </h1>
        <p className="text-slate-400">Upload your certificate to request AICTE activity points.</p>
      </div>

      <div className="glass-panel rounded-2xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-6 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Activity Name</label>
              <input type="text" required placeholder="e.g. Smart India Hackathon" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Location / Platform</label>
              <input type="text" required placeholder="e.g. AICTE Portal, Coursera" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.where} onChange={e => setFormData({...formData, where: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Points Requested</label>
              <input type="number" required min="1" placeholder="e.g. 10" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.pointsRequested} onChange={e => setFormData({...formData, pointsRequested: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <input type="text" required placeholder="Brief summary of what you did" className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="relative group cursor-pointer" onClick={() => document.getElementById('certFile').click()}>
            <div className={`absolute inset-0 bg-primary/5 rounded-2xl border-2 border-dashed transition-colors ${file ? 'border-primary' : 'border-slate-700 group-hover:border-primary/50'}`} />
            <div className="relative py-12 flex flex-col items-center justify-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ${file ? 'bg-primary/20 text-primary scale-110 shadow-[0_0_20px_rgba(139,92,246,0.3)]' : 'bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
                {file ? <CheckCircle size={40} /> : <UploadCloud size={40} />}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{file ? file.name : 'Upload Certificate'}</h3>
              <p className="text-sm text-slate-400">{file ? 'Ready to submit' : 'Upload your certificate (PDF/JPG/PNG)'}</p>
              <input id="certFile" type="file" accept=".pdf, image/*" className="hidden" onChange={e => handleFileSelect(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" disabled={isUploading || !file} className="mt-4 bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-lg w-full">
            {isUploading ? 'Encrypting & Uploading...' : 'Submit Point Request'} <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default StudentSubmit;
