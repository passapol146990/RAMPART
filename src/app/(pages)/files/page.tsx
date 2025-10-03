// app/files/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  uploadedBy: string
  status: 'completed' | 'failed' | 'analyzing'
  riskScore?: number
  malwareType?: string
  hashes: {
    md5: string
    sha1: string
    sha256: string
  }
  icon?: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed' | 'analyzing'>('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'risk'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    // Mock data - ใน production จะดึงจาก API
    const mockFiles: FileItem[] = [
      {
        id: '1',
        name: 'suspicious_app.apk',
        size: 25485760,
        type: 'apk',
        uploadDate: '2024-01-20 14:30:25',
        uploadedBy: 'admin',
        status: 'completed',
        riskScore: 8.5,
        malwareType: 'Trojan',
        hashes: {
          md5: 'd41d8cd98f00b204e9800998ecf8427e',
          sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      },
      {
        id: '2',
        name: 'system_tool.exe',
        size: 15874230,
        type: 'exe',
        uploadDate: '2024-01-20 13:15:10',
        uploadedBy: 'analyst1',
        status: 'analyzing',
        hashes: {
          md5: 'a1b2c3d4e5f678901234567890123456',
          sha1: 'a1b2c3d4e5f67890123456789012345678901234',
          sha256: 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678'
        }
      },
      {
        id: '3',
        name: 'document_reader.msi',
        size: 4578120,
        type: 'msi',
        uploadDate: '2024-01-20 12:45:30',
        uploadedBy: 'user123',
        status: 'failed',
        hashes: {
          md5: 'b2c3d4e5f67890123456789012345678',
          sha1: 'b2c3d4e5f678901234567890123456789012345',
          sha256: 'b2c3d4e5f67890123456789012345678901234567890123456789012345679'
        }
      },
      {
        id: '4',
        name: 'backup_script.bat',
        size: 102400,
        type: 'bat',
        uploadDate: '2024-01-20 11:20:15',
        uploadedBy: 'admin',
        status: 'completed',
        riskScore: 3.2,
        malwareType: 'Clean',
        hashes: {
          md5: 'c3d4e5f6789012345678901234567890',
          sha1: 'c3d4e5f6789012345678901234567890123456',
          sha256: 'c3d4e5f67890123456789012345678901234567890123456789012345680'
        }
      },
      {
        id: '5',
        name: 'installer_package.dmg',
        size: 89456120,
        type: 'dmg',
        uploadDate: '2024-01-20 10:05:45',
        uploadedBy: 'analyst2',
        status: 'completed',
        riskScore: 7.8,
        malwareType: 'Adware',
        hashes: {
          md5: 'd4e5f678901234567890123456789012',
          sha1: 'd4e5f67890123456789012345678901234567',
          sha256: 'd4e5f67890123456789012345678901234567890123456789012345681'
        }
      }
    ]

    setTimeout(() => {
      setFiles(mockFiles)
      setFilteredFiles(mockFiles)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let result = files

    // Filter by search term
    if (searchTerm) {
      result = result.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.hashes.md5.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(file => file.status === statusFilter)
    }

    // Filter by file type
    if (typeFilter !== 'all') {
      result = result.filter(file => file.type === typeFilter)
    }

    // Sort files
    result = [...result].sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'size':
          aValue = a.size
          bValue = b.size
          break
        case 'risk':
          aValue = a.riskScore || 0
          bValue = b.riskScore || 0
          break
        case 'date':
        default:
          aValue = new Date(a.uploadDate).getTime()
          bValue = new Date(b.uploadDate).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredFiles(result)
  }, [files, searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: string } = {
      apk: 'fa-android',
      exe: 'fa-windows',
      msi: 'fa-cube',
      bat: 'fa-terminal',
      dmg: 'fa-apple',
      pdf: 'fa-file-pdf',
      doc: 'fa-file-word',
      docx: 'fa-file-word',
      xls: 'fa-file-excel',
      xlsx: 'fa-file-excel',
      zip: 'fa-file-archive',
      rar: 'fa-file-archive',
      '7z': 'fa-file-archive',
      js: 'fa-file-code',
      ps1: 'fa-terminal'
    }

    return iconMap[fileType] || 'fa-file'
  }

  const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'analyzing': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusText = (status: FileItem['status']) => {
    switch (status) {
      case 'completed': return 'สำเร็จ'
      case 'analyzing': return 'กำลังวิเคราะห์'
      case 'failed': return 'ไม่สำเร็จ'
      default: return 'รอดำเนินการ'
    }
  }

  const getRiskColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 8) return 'text-red-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-green-400'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e293b] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-lg">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e293b] p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <Link href="/dashboard" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 relative group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/RAMPART-LOGO.png"
                alt="RAMPART"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                File Repository
              </h1>
              <p className="text-blue-200/60 text-sm">
                ไฟล์ทั้งหมดในระบบวิเคราะห์มัลแวร์
              </p>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-medium">ไฟล์ทั้งหมด</p>
            <p className="text-cyan-400 text-2xl font-bold">{files.length} ไฟล์</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-blue-100 mb-2">
              ค้นหาไฟล์
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-cyan-400"></i>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                placeholder="ค้นหาด้วยชื่อไฟล์, ผู้ใช้งาน, หรือ Hash..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-2">
              สถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
            >
              <option value="all">ทั้งหมด</option>
              <option value="completed">สำเร็จ</option>
              <option value="analyzing">กำลังวิเคราะห์</option>
              <option value="failed">ไม่สำเร็จ</option>
            </select>
          </div>

          {/* File Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-2">
              ประเภทไฟล์
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
            >
              <option value="all">ทั้งหมด</option>
              <option value="apk">APK</option>
              <option value="exe">EXE</option>
              <option value="msi">MSI</option>
              <option value="bat">BAT</option>
              <option value="dmg">DMG</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <span className="text-blue-200/60 text-sm">เรียงตาม:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'date', label: 'วันที่' },
              { value: 'name', label: 'ชื่อไฟล์' },
              { value: 'size', label: 'ขนาด' },
              { value: 'risk', label: 'ความเสี่ยง' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  if (sortBy === option.value) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy(option.value as any)
                    setSortOrder('desc')
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  sortBy === option.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-blue-200/60 hover:text-white'
                }`}
              >
                {option.label}
                {sortBy === option.value && (
                  <i className={`fas fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'} ml-1 text-xs`}></i>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas ${getFileIcon(file.type)} text-cyan-400 text-2xl`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-semibold truncate text-lg">
                      {file.name}
                    </h3>
                    <span className="text-blue-200/60 text-sm bg-white/5 px-2 py-1 rounded">
                      .{file.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-blue-200/60">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.uploadedBy}</span>
                    <span>•</span>
                    <span>{formatDate(file.uploadDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                  {getStatusText(file.status)}
                </span>
                
                {file.riskScore && (
                  <div className={`text-lg font-bold ${getRiskColor(file.riskScore)}`}>
                    {file.riskScore}/10
                  </div>
                )}
              </div>
            </div>

            {/* File Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200/60">MD5:</span>
                  <span className="text-white font-mono text-xs truncate ml-2">
                    {file.hashes.md5}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200/60">SHA1:</span>
                  <span className="text-white font-mono text-xs truncate ml-2">
                    {file.hashes.sha1}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200/60">SHA256:</span>
                  <span className="text-white font-mono text-xs truncate ml-2">
                    {file.hashes.sha256}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {file.malwareType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/60">ประเภทมัลแวร์:</span>
                    <span className={`font-medium ${
                      file.malwareType === 'Clean' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {file.malwareType}
                    </span>
                  </div>
                )}
                
                {file.riskScore && (
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        file.riskScore >= 8 ? 'bg-red-500' :
                        file.riskScore >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${file.riskScore * 10}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Link
                  href={`/files/${file.id}`}
                  className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2"
                >
                  <i className="fas fa-eye"></i>
                  <span>ดูรายละเอียด</span>
                </Link>
                
                {file.status === 'completed' && (
                  <button className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2">
                    <i className="fas fa-download"></i>
                    <span>ดาวน์โหลดรายงาน</span>
                  </button>
                )}
              </div>

              <div className="flex space-x-2">
                <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-300">
                  <i className="fas fa-envelope"></i>
                </button>
                <button className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all duration-300">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <i className="fas fa-file-search text-cyan-400 text-3xl"></i>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">ไม่พบไฟล์</h3>
          <p className="text-blue-200/60">
            ไม่พบไฟล์ที่ตรงกับการค้นหาของคุณ
          </p>
        </div>
      )}
    </div>
  )
}