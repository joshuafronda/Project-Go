import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Document, User } from '../../types';
import { FileText, Download, Eye, Upload, Filter, Grid, List } from 'lucide-react';

interface DocumentsViewProps {
  currentUser: User;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ currentUser }) => {
  const { documents, projects, addDocument } = useProject();
  const [filterProject, setFilterProject] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const [newDoc, setNewDoc] = useState<{name: string, projectId: string, type: 'pdf' | 'xls' | 'img' | 'doc'}>({
    name: '',
    projectId: 'p1',
    type: 'pdf'
  });

  const filteredDocs = filterProject === 'all' 
    ? documents 
    : documents.filter(d => d.projectId === filterProject);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
        id: 'd' + Date.now(),
        name: newDoc.name,
        type: newDoc.type,
        size: (Math.random() * 5 + 1).toFixed(1) + ' MB',
        uploadedBy: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        projectId: newDoc.projectId,
        version: 1
    });
    setIsUploadOpen(false);
    setNewDoc({ name: '', projectId: 'p1', type: 'pdf' });
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="text-red-500" size={24} />;
        case 'xls': return <FileText className="text-green-500" size={24} />;
        case 'img': return <FileText className="text-blue-500" size={24} />;
        default: return <FileText className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
           <p className="text-gray-500">Centralized storage for blueprints, contracts, and reports.</p>
        </div>
        <div className="flex items-center space-x-3">
             <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                    <List size={18} />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                    <Grid size={18} />
                </button>
             </div>
             <button 
                onClick={() => setIsUploadOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
             >
                <Upload size={18} className="mr-2" />
                Upload Document
             </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2">
         <button 
            onClick={() => setFilterProject('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
            ${filterProject === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
         >
            All Projects
         </button>
         {projects.map(p => (
             <button 
                key={p.id}
                onClick={() => setFilterProject(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
                ${filterProject === p.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
             >
                {p.name}
             </button>
         ))}
      </div>

      {viewMode === 'list' ? (
          <Card className="overflow-hidden">
             <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Project</th>
                        <th className="px-6 py-4">Uploaded By</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Size</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="mr-3">{getIcon(doc.type)}</div>
                                    <div>
                                        <div className="font-medium text-gray-900">{doc.name}</div>
                                        <div className="text-xs text-gray-400">v{doc.version}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{projects.find(p => p.id === doc.projectId)?.name || '-'}</td>
                            <td className="px-6 py-4">{doc.uploadedBy}</td>
                            <td className="px-6 py-4">{doc.date}</td>
                            <td className="px-6 py-4">{doc.size}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-blue-600 mr-3"><Eye size={18} /></button>
                                <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </Card>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDocs.map(doc => (
                  <div key={doc.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-lg transition group relative">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                          <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
                      </div>
                      <div className="flex flex-col items-center text-center mb-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                              {getIcon(doc.type)}
                          </div>
                          <h3 className="font-medium text-gray-900 truncate w-full" title={doc.name}>{doc.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{doc.size} • {doc.date}</p>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs text-gray-500">
                          <span>v{doc.version}</span>
                          <span>{doc.uploadedBy.split(' ')[0]}</span>
                      </div>
                  </div>
              ))}
          </div>
      )}

      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document">
         <form onSubmit={handleUpload} className="space-y-4">
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                 <input 
                    required
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newDoc.name}
                    onChange={e => setNewDoc({...newDoc, name: e.target.value})}
                 />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                 <select 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newDoc.projectId}
                    onChange={e => setNewDoc({...newDoc, projectId: e.target.value})}
                 >
                     {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                 <select 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newDoc.type}
                    onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                 >
                     <option value="pdf">PDF Document</option>
                     <option value="xls">Excel Spreadsheet</option>
                     <option value="img">Image File</option>
                     <option value="doc">Word Document</option>
                 </select>
             </div>
             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                 <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                 <p className="text-sm">Drag and drop file here, or click to browse</p>
             </div>
             <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
                 Upload
             </button>
         </form>
      </Modal>
    </div>
  );
};
