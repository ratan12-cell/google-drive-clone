import React, { useState, useEffect } from 'react';
import { Upload, Folder, File, MoreVertical, Download, Trash2, Share2, Star, Grid, List, Search, Plus, Home, Clock, Users, FolderOpen, ArrowLeft, RotateCcw } from 'lucide-react';
import './styles.css';

const DriveClone = () => {
  const [view, setView] = useState('grid');
  const [currentView, setCurrentView] = useState('drive');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [items, setItems] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [shareItem, setShareItem] = useState(null);
  const [shareEmail, setShareEmail] = useState('');

  
  useEffect(() => {
    const sampleData = [
      { id: '1', name: 'Documents', type: 'folder', size: null, modified: '2024-10-20', parentId: null, starred: false, deleted: false, shared: false },
      { id: '2', name: 'Images', type: 'folder', size: null, modified: '2024-10-19', parentId: null, starred: true, deleted: false, shared: false },
      { id: '3', name: 'Project Proposal.pdf', type: 'file', size: '2.4 MB', modified: '2024-10-22', parentId: null, starred: false, deleted: false, shared: false },
      { id: '4', name: 'Budget 2024.xlsx', type: 'file', size: '156 KB', modified: '2024-10-21', parentId: null, starred: false, deleted: false, shared: false },
      { id: '5', name: 'Presentation.pptx', type: 'file', size: '5.8 MB', modified: '2024-10-18', parentId: null, starred: true, deleted: false, shared: false },
      { id: '6', name: 'Meeting Notes.docx', type: 'file', size: '45 KB', modified: '2024-10-15', parentId: '1', starred: false, deleted: false, shared: false },
      { id: '7', name: 'Contract.pdf', type: 'file', size: '890 KB', modified: '2024-10-14', parentId: '1', starred: false, deleted: false, shared: false },
      { id: '8', name: 'Vacation Photo.jpg', type: 'file', size: '3.2 MB', modified: '2024-10-10', parentId: '2', starred: false, deleted: false, shared: false },
    ];
    setItems(sampleData);
  }, []);

  const getCurrentItems = () => {
    let baseItems;
    switch (currentView) {
      case 'drive':
        baseItems = items.filter(item => !item.deleted && item.parentId === currentFolder);
        break;
      case 'starred':
        baseItems = items.filter(item => !item.deleted && item.starred);
        break;
      case 'recent':
        baseItems = items.filter(item => !item.deleted).sort((a, b) => new Date(b.modified) - new Date(a.modified));
        break;
      case 'trash':
        baseItems = trashItems;
        break;
      case 'shared':
        baseItems = items.filter(item => !item.deleted && item.shared);
        break;
      default:
        baseItems = items.filter(item => !item.deleted && item.parentId === currentFolder);
    }
    return searchQuery
      ? baseItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : baseItems;
  };

  const currentItems = getCurrentItems();
  const filteredItems = currentItems;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newItems = files.map((file, index) => ({
      id: Date.now() + index + '',
      name: file.name,
      type: 'file',
      size: formatFileSize(file.size),
      modified: new Date().toISOString().split('T')[0],
      parentId: currentFolder,
      starred: false,
      deleted: false,
      shared: false
    }));
    setItems([...items, ...newItems]);
    setShowUploadModal(false);
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now() + '',
        name: newFolderName,
        type: 'folder',
        size: null,
        modified: new Date().toISOString().split('T')[0],
        parentId: currentFolder,
        starred: false,
        deleted: false,
        shared: false
      };
      setItems([...items, newFolder]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete) {
      setItems(items.map(item => item.id === id ? { ...item, deleted: true } : item));
      setTrashItems([...trashItems, { ...itemToDelete, deleted: true }]);
    }
    setActiveMenu(null);
  };

  const restoreItem = (id) => {
    const itemToRestore = trashItems.find(item => item.id === id);
    if (itemToRestore) {
      setItems(items.map(item => item.id === id ? { ...item, deleted: false } : item));
      setTrashItems(trashItems.filter(item => item.id !== id));
    }
    setActiveMenu(null);
  };

  const openShareModal = (id) => {
    const item = items.find(item => item.id === id);
    setShareItem(item);
    setShowShareModal(true);
    setActiveMenu(null);
  };

  const handleShare = () => {
    if (shareEmail.trim() && shareItem) {
      // Simulate sharing
      alert(`Shared "${shareItem.name}" with ${shareEmail}`);
      setItems(items.map(item => item.id === shareItem.id ? { ...item, shared: true } : item));
      setShowShareModal(false);
      setShareEmail('');
      setShareItem(null);
    }
  };

  const downloadItem = (id) => {
    const item = items.find(item => item.id === id);
    if (item && item.type === 'file') {
      // Simulate download
      alert(`Downloaded "${item.name}"`);
    }
    setActiveMenu(null);
  };

  const toggleStar = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, starred: !item.starred } : item
    ));
    setActiveMenu(null);
  };

  const openFolder = (folderId) => {
    if (currentView === 'drive') {
      setCurrentFolder(folderId);
      setSearchQuery('');
    }
  };

  const goBack = () => {
    const parent = items.find(item => item.id === currentFolder);
    setCurrentFolder(parent?.parentId || null);
  };

  const changeView = (newView) => {
    setCurrentView(newView);
    setCurrentFolder(null);
    setSearchQuery('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (item) => {
    if (item.type === 'folder') return <Folder className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const getCurrentPath = () => {
    if (currentView !== 'drive') {
      switch (currentView) {
        case 'starred': return 'Starred';
        case 'recent': return 'Recent';
        case 'trash': return 'Trash';
        case 'shared': return 'Shared with me';
        default: return 'My Drive';
      }
    }
    if (!currentFolder) return 'My Drive';
    const path = [];
    let current = currentFolder;
    while (current) {
      const folder = items.find(item => item.id === current);
      if (folder) {
        path.unshift(folder.name);
        current = folder.parentId;
      } else break;
    }
    return path.join(' / ');
  };

  return (
    <div className="drive-container">
      {/* Header */}
      <header className="drive-header">
        <div className="drive-logo">
          <div className="drive-logo-icon">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="drive-title">Google Drive Clone</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="view-toggle">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="view-toggle-btn"
            title={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {view === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="drive-main">
        {/* Sidebar */}
        <aside className="drive-sidebar">
          <button
            onClick={() => setShowUploadModal(true)}
            className="new-btn"
          >
            <Plus className="w-5 h-5" />
            <span>New</span>
          </button>

          <nav>
            <button
              onClick={() => changeView('drive')}
              className={`nav-btn ${currentView === 'drive' ? 'active' : ''}`}
            >
              <Home className="nav-icon" />
              <span>My Drive</span>
            </button>
            <button
              onClick={() => changeView('shared')}
              className={`nav-btn ${currentView === 'shared' ? 'active' : ''}`}
            >
              <Users className="nav-icon" />
              <span>Shared with me</span>
            </button>
            <button
              onClick={() => changeView('recent')}
              className={`nav-btn ${currentView === 'recent' ? 'active' : ''}`}
            >
              <Clock className="nav-icon" />
              <span>Recent</span>
            </button>
            <button
              onClick={() => changeView('starred')}
              className={`nav-btn ${currentView === 'starred' ? 'active' : ''}`}
            >
              <Star className="nav-icon" />
              <span>Starred</span>
            </button>
            <button
              onClick={() => changeView('trash')}
              className={`nav-btn ${currentView === 'trash' ? 'active' : ''}`}
            >
              <Trash2 className="nav-icon" />
              <span>Trash</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="drive-content">
          <div className="content-header">
            <div className="breadcrumb">
              {currentFolder && currentView === 'drive' && (
                <button
                  onClick={goBack}
                  className="back-btn"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="current-path">{getCurrentPath()}</h2>
            </div>
            <div className="action-buttons">
              {currentView === 'drive' && (
                <>
                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="action-btn"
                  >
                    <Folder className="w-4 h-4" />
                    <span>New Folder</span>
                  </button>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="action-btn"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <FolderOpen className="empty-icon" />
              <p className="empty-title">
                {currentView === 'trash' ? 'Trash is empty' :
                 currentView === 'starred' ? 'No starred items' :
                 currentView === 'shared' ? 'No shared items' :
                 currentView === 'recent' ? 'No recent items' :
                 'No files or folders'}
              </p>
              <p className="empty-subtitle">
                {currentView === 'drive' ? 'Upload files or create folders to get started' : ''}
              </p>
            </div>
          ) : (
            <div className="files-container">
              <div className={view === 'grid' ? 'files-grid' : 'files-list'}>
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={view === 'grid' ? 'file-card' : 'file-row'}
                    onDoubleClick={() => item.type === 'folder' && openFolder(item.id)}
                  >
                    <div className={view === 'grid' ? 'file-icon' : 'file-info'}>
                      <div className={view === 'grid' ? '' : 'file-list-icon'}>
                        {getFileIcon(item)}
                      </div>
                      <div className={view === 'grid' ? '' : 'file-details'}>
                        <p className={view === 'grid' ? 'file-name' : 'file-list-name'} title={item.name}>{item.name}</p>
                        {view === 'list' && (
                          <p className="file-meta">{item.modified}</p>
                        )}
                      </div>
                      {view === 'list' && item.size && (
                        <p className="file-size">{item.size}</p>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === item.id ? null : item.id);
                        }}
                        className="context-menu-btn"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenu === item.id && (
                        <div className="context-menu">
                          {currentView !== 'trash' && (
                            <>
                              <button
                                onClick={() => toggleStar(item.id)}
                                className="context-menu-item"
                              >
                                <Star className={`w-4 h-4 ${item.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                <span>{item.starred ? 'Unstar' : 'Star'}</span>
                              </button>
                              <button
                                onClick={() => openShareModal(item.id)}
                                className="context-menu-item"
                              >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                              {item.type === 'file' && (
                                <button
                                  onClick={() => downloadItem(item.id)}
                                  className="context-menu-item"
                                >
                                  <Download className="w-4 h-4" />
                                  <span>Download</span>
                                </button>
                              )}
                              <div className="context-menu-divider"></div>
                            </>
                          )}
                          <button
                            onClick={() => currentView === 'trash' ? restoreItem(item.id) : deleteItem(item.id)}
                            className={`context-menu-item ${currentView === 'trash' ? 'success' : 'danger'}`}
                          >
                            {currentView === 'trash' ? <RotateCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                            <span>{currentView === 'trash' ? 'Restore' : 'Delete'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Upload Files</h3>
            <div className="modal-body">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="modal-file-input"
              />
              <p className="modal-help-text">Select multiple files to upload</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowUploadModal(false)}
                className="modal-btn secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Create New Folder</h3>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                className="modal-input"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
                className="modal-btn secondary"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                className="modal-btn primary"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Share "{shareItem.name}"</h3>
            <div className="modal-body">
              <input
                type="email"
                placeholder="Enter email address"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="modal-input"
                autoFocus
              />
              <p className="modal-help-text">Share this item with others</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareEmail('');
                  setShareItem(null);
                }}
                className="modal-btn secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="modal-btn primary"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveClone;