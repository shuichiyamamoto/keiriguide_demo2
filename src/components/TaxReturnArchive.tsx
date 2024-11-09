import React, { useState } from 'react';
import { FileText, Upload, Download, Eye, Trash2, AlertCircle } from 'lucide-react';

interface TaxReturn {
  id: string;
  year: number;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  type: '確定申告書' | '収支内訳書' | '青色申告決算書';
}

const TaxReturnArchive: React.FC = () => {
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([
    {
      id: '1',
      year: 2023,
      fileName: '令和5年分確定申告書.pdf',
      uploadDate: '2024-03-15',
      fileSize: '2.4 MB',
      type: '確定申告書',
    },
    {
      id: '2',
      year: 2023,
      fileName: '令和5年分青色申告決算書.pdf',
      uploadDate: '2024-03-15',
      fileSize: '1.8 MB',
      type: '青色申告決算書',
    },
  ]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      // PDFファイルのみを許可
      if (file.type === 'application/pdf') {
        const newTaxReturn: TaxReturn = {
          id: Math.random().toString(36).substr(2, 9),
          year: new Date().getFullYear(),
          fileName: file.name,
          uploadDate: new Date().toISOString().split('T')[0],
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: '確定申告書',
        };
        setTaxReturns(prev => [...prev, newTaxReturn]);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('本当にこのファイルを削除しますか？')) {
      setTaxReturns(prev => prev.filter(tr => tr.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">確定申告書アーカイブ</h2>
      
      {/* アップロードエリア */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-slate-300 hover:border-primary-400'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600 mb-2">
            確定申告書をドラッグ＆ドロップ
          </p>
          <p className="text-sm text-slate-500 mb-4">
            または
          </p>
          <label className="cursor-pointer">
            <span className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              ファイルを選択
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
            />
          </label>
          <p className="text-xs text-slate-500 mt-4">
            PDFファイルのみ対応（最大10MB）
          </p>
        </div>
      </div>

      {/* ファイル一覧 */}
      <div className="space-y-4">
        {taxReturns.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">アップロードされたファイルはありません</p>
          </div>
        ) : (
          taxReturns.map(taxReturn => (
            <div
              key={taxReturn.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="font-medium text-slate-900">{taxReturn.fileName}</p>
                  <p className="text-sm text-slate-500">
                    {taxReturn.year}年度 • {taxReturn.type} • {taxReturn.fileSize} • 
                    アップロード日: {new Date(taxReturn.uploadDate).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  title="プレビュー"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  title="ダウンロード"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="削除"
                  onClick={() => handleDelete(taxReturn.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaxReturnArchive;