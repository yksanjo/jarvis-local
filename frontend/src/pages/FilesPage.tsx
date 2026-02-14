import { useState } from 'react'
import { FolderPlus, Search, File, Folder, Tag, Trash2 } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import './FilesPage.css'

export function FilesPage() {
  const { files, indexedFolders, indexFolder, searchFiles } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof files>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    const results = await searchFiles(searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleIndexFolder = async () => {
    // In a real app, this would open a folder picker dialog
    const folderPath = '/Users/yoshikondo/Documents'
    await indexFolder(folderPath)
  }

  return (
    <div className="page files-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Files</h1>
          <p className="page-subtitle">Search and organize your local files</p>
        </div>
        <button className="btn-primary" onClick={handleIndexFolder}>
          <FolderPlus size={18} />
          Index Folder
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search files by name or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {indexedFolders.length > 0 && (
        <div className="indexed-folders">
          <h4>Indexed Folders</h4>
          <div className="folder-list">
            {indexedFolders.map((folder, index) => (
              <div key={index} className="folder-item">
                <Folder size={16} />
                <span>{folder}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="files-results">
        {isSearching ? (
          <div className="loading">
            <div className="loading-spinner" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="files-list">
            {searchResults.map((file) => (
              <div key={file.id} className="file-card">
                <File size={20} className="file-icon" />
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-path">{file.path}</div>
                </div>
                <div className="file-tags">
                  {file.tags.map((tag, index) => (
                    <span key={index} className="badge badge-primary">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FolderSearch size={48} className="empty-state-icon" />
            <h3 className="empty-state-title">No files indexed</h3>
            <p className="empty-state-description">
              Add folders to index your local files for fast searching. All indexing happens locally.
            </p>
            <button className="btn-primary" onClick={handleIndexFolder}>
              <FolderPlus size={18} />
              Index a Folder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
