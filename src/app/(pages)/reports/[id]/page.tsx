// appreports/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import NavbarComponent from '@/components/NavbarComponent'

interface FileDetail {
  id: string
  name: string
  size: number
  type: string
  uploadDate: string
  uploadedBy: string
  status: 'completed' | 'failed' | 'analyzing'
  riskScore: number
  malwareType: string
  hashes: {
    md5: string
    sha1: string
    sha256: string
  }
  analysisResults: {
    behaviors: {
      fileCreations: string[]
      registryChanges: string[]
      networkConnections: string[]
      suspiciousDomains: string[]
      apiCalls: string[]
    }
    signatures: Array<{
      name: string
      severity: 'low' | 'medium' | 'high'
      description: string
    }>
    staticAnalysis: {
      imports: string[]
      strings: string[]
      resources: string[]
    }
    dynamicAnalysis: {
      processes: string[]
      networkTraffic: string[]
      systemChanges: string[]
    }
  }
  analysisEngines: {
    capev2: {
      status: 'completed' | 'failed' | 'running'
      score: number
      detection: string
    }
    mobsf: {
      status: 'completed' | 'failed' | 'running'
      score: number
      findings: string[]
    }
  }
  downloadLinks: {
    report_pdf: string
    report_json: string
    analysis_log: string
  }
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [file, setFile] = useState<FileDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [emailDialog, setEmailDialog] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')

  useEffect(() => {
    // Mock data - ใน production จะดึงจาก API โดยใช้ params.id
    const mockFile: FileDetail = {
      id: params.id as string,
      name: 'suspicious_app.apk',
      size: 25485760,
      type: 'apk',
      uploadDate: '2024-01-20 14:30:25',
      uploadedBy: 'admin',
      status: 'completed',
      riskScore: 8.5,
      malwareType: 'Trojan.AndroidOS.FakeApp',
      hashes: {
        md5: 'd41d8cd98f00b204e9800998ecf8427e',
        sha1: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      analysisResults: {
        behaviors: {
          fileCreations: [
            '/system/app/UpdateService.apk',
            '/data/data/com.fakeapp/temp.bin',
            '/sdcard/Download/secret.zip'
          ],
          registryChanges: [
            'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\FakeUpdate',
            'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\BackgroundService'
          ],
          networkConnections: [
            '185.159.82.12:443 (Russia)',
            '94.23.45.67:80 (France)',
            '203.45.67.89:443 (Thailand)'
          ],
          suspiciousDomains: [
            'update-service-android.com',
            'secure-download-server.net',
            'android-package-manager.org'
          ],
          apiCalls: [
            'android.permission.READ_SMS',
            'android.permission.SEND_SMS',
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.CAMERA'
          ]
        },
        signatures: [
          {
            name: 'Trojan Behavior',
            severity: 'high',
            description: 'Attempts to send SMS messages without user consent'
          },
          {
            name: 'Data Theft',
            severity: 'high',
            description: 'Accesses contact list and SMS database'
          },
          {
            name: 'Root Detection',
            severity: 'medium',
            description: 'Checks for root access on device'
          },
          {
            name: 'Anti-Analysis',
            severity: 'medium',
            description: 'Detects emulator environment'
          }
        ],
        staticAnalysis: {
          imports: [
            'android.telephony.SmsManager',
            'android.location.LocationManager',
            'java.net.HttpURLConnection',
            'android.hardware.Camera'
          ],
          strings: [
            'http://malicious-server.com/upload',
            '+66987456321',
            'Banking App Update Required',
            'Your account has been compromised'
          ],
          resources: [
            'ic_launcher.png (Suspicious icon)',
            'config.xml (Encrypted configuration)',
            'certificate.pem (Self-signed cert)'
          ]
        },
        dynamicAnalysis: {
          processes: [
            'com.fakeapp:service (Background service)',
            'system_update_daemon (Suspicious process)',
            'media_player_helper (Disguised malware)'
          ],
          networkTraffic: [
            'POST /upload/data - 2.5MB uploaded',
            'GET /config/update - Configuration fetched',
            'POST /sms/send - SMS data sent'
          ],
          systemChanges: [
            'Added autostart entry',
            'Modified browser homepage',
            'Installed additional APK silently'
          ]
        }
      },
      analysisEngines: {
        capev2: {
          status: 'completed',
          score: 8.7,
          detection: 'Trojan.AndroidOS.FakeApp'
        },
        mobsf: {
          status: 'completed',
          score: 8.2,
          findings: [
            'Insecure data storage',
            'SMS permission abuse',
            'Hardcoded API keys',
            'Certificate pinning bypass'
          ]
        }
      },
      downloadLinks: {
        report_pdf: '/reports/sample.pdf',
        report_json: '/reports/sample.json',
        analysis_log: '/logs/sample.log'
      }
    }

    setTimeout(() => {
      setFile(mockFile)
      setIsLoading(false)
    }, 1500)
  }, [params.id])

  const handleSendEmail = () => {
    // ส่งอีเมลแจ้งเตือน
    console.log('Sending email to:', emailAddress)
    setEmailDialog(false)
    setEmailAddress('')
  }

  const handleDownloadReport = (type: string) => {
    // ดาวน์โหลดรายงาน
    console.log('Downloading report:', type)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'analyzing': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
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

  if (!file) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e293b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <i className="fas fa-file-exclamation text-red-400 text-3xl"></i>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">ไม่พบไฟล์</h3>
          <p className="text-blue-200/60 mb-4">ไม่พบไฟล์ที่คุณต้องการดู</p>
          <Link
            href="reports"
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold transition-all duration-300"
          >
            กลับไปหน้ารายการไฟล์
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e293b] p-6">
      {/* Header */}
      <NavbarComponent/>  

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* File Info Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                <i className="fas fa-file text-cyan-400 text-3xl"></i>
              </div>
              <h2 className="text-white font-semibold text-lg mb-2 truncate">
                {file.name}
              </h2>
              <span className="text-blue-200/60 bg-white/5 px-3 py-1 rounded-full text-sm">
                .{file.type}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">ขนาดไฟล์:</span>
                <span className="text-white font-medium">{formatFileSize(file.size)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">อัพโหลดโดย:</span>
                <span className="text-white font-medium">{file.uploadedBy}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">วันที่อัพโหลด:</span>
                <span className="text-white font-medium text-sm">{formatDate(file.uploadDate)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">สถานะ:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                  {file.status === 'completed' ? 'วิเคราะห์เสร็จสิ้น' : 
                   file.status === 'analyzing' ? 'กำลังวิเคราะห์' : 'วิเคราะห์ล้มเหลว'}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">คะแนนความเสี่ยง</h3>
            
            <div className="text-center mb-4">
              <div className={`text-4xl font-black mb-2 ${
                file.riskScore >= 8 ? 'text-red-400' :
                file.riskScore >= 6 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {file.riskScore}/10
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    file.riskScore >= 8 ? 'bg-red-500' :
                    file.riskScore >= 6 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${file.riskScore * 10}%` }}
                ></div>
              </div>
              <p className="text-blue-200/60 text-sm">
                {file.riskScore >= 8 ? 'ความเสี่ยงสูง' :
                 file.riskScore >= 6 ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงต่ำ'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">ประเภทมัลแวร์:</span>
                <span className="text-red-400 font-medium">{file.malwareType}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">CAPEv2 Score:</span>
                <span className="text-white font-medium">{file.analysisEngines.capev2.score}/10</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200/60">MobSF Score:</span>
                <span className="text-white font-medium">{file.analysisEngines.mobsf.score}/10</span>
              </div>
            </div>
          </div>

          {/* Hash Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">ข้อมูล Hash</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-blue-200/60 text-sm block mb-1">MD5:</span>
                <code className="text-white font-mono text-sm bg-white/5 p-2 rounded-lg block break-all">
                  {file.hashes.md5}
                </code>
              </div>
              
              <div>
                <span className="text-blue-200/60 text-sm block mb-1">SHA1:</span>
                <code className="text-white font-mono text-sm bg-white/5 p-2 rounded-lg block break-all">
                  {file.hashes.sha1}
                </code>
              </div>
              
              <div>
                <span className="text-blue-200/60 text-sm block mb-1">SHA256:</span>
                <code className="text-white font-mono text-sm bg-white/5 p-2 rounded-lg block break-all">
                  {file.hashes.sha256}
                </code>
              </div>
            </div>
          </div>

          {/* Download Reports */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">ดาวน์โหลดรายงาน</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleDownloadReport('pdf')}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-file-pdf"></i>
                <span>รายงาน PDF</span>
              </button>
              
              <button
                onClick={() => handleDownloadReport('json')}
                className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-file-code"></i>
                <span>รายงาน JSON</span>
              </button>
              
              <button
                onClick={() => handleDownloadReport('log')}
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg py-3 px-4 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <i className="fas fa-file-alt"></i>
                <span>ไฟล์ Log</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-3">
          {/* Tab Navigation */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex space-x-1 bg-white/5 rounded-xl p-1">
              {[
                { id: 'overview', label: 'ภาพรวม', icon: 'fa-chart-pie' },
                { id: 'behaviors', label: 'พฤติกรรม', icon: 'fa-code' },
                { id: 'signatures', label: 'ภัยคุกคาม', icon: 'fa-shield-alt' },
                { id: 'static', label: 'Static Analysis', icon: 'fa-search' },
                { id: 'dynamic', label: 'Dynamic Analysis', icon: 'fa-play' },
                { id: 'network', label: 'เครือข่าย', icon: 'fa-globe' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-blue-200/60 hover:text-white'
                  }`}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <i className="fas fa-bug text-red-400"></i>
                      <span>พฤติกรรมที่น่าสงสัย</span>
                    </h4>
                    <ul className="space-y-2">
                      {file.analysisResults.behaviors.suspiciousDomains.slice(0, 3).map((domain, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <i className="fas fa-exclamation-triangle text-yellow-400 text-xs"></i>
                          <span className="text-white">{domain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <i className="fas fa-network-wired text-blue-400"></i>
                      <span>การเชื่อมต่อเครือข่าย</span>
                    </h4>
                    <ul className="space-y-2">
                      {file.analysisResults.behaviors.networkConnections.slice(0, 3).map((conn, index) => (
                        <li key={index} className="text-sm text-white">
                          {conn}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">สรุปการวิเคราะห์</h4>
                  <p className="text-blue-200/60 leading-relaxed">
                    ไฟล์นี้ถูกตรวจพบว่าเป็นมัลแวร์ประเภท {file.malwareType} 
                    ที่มีพฤติกรรมน่าสงสัยหลายประการ รวมถึงการพยายามส่ง SMS โดยไม่ได้รับความยินยอม,
                    การเข้าถึงข้อมูลส่วนตัวบนอุปกรณ์, และการเชื่อมต่อไปยังเซิร์ฟเวอร์ที่น่าสงสัยในต่างประเทศ
                  </p>
                </div>
              </div>
            )}

            {/* Behaviors Tab */}
            {activeTab === 'behaviors' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <i className="fas fa-file-plus text-green-400"></i>
                      <span>การสร้างไฟล์</span>
                    </h4>
                    <ul className="space-y-2">
                      {file.analysisResults.behaviors.fileCreations.map((file, index) => (
                        <li key={index} className="text-sm text-white flex items-center space-x-2">
                          <i className="fas fa-caret-right text-cyan-400 text-xs"></i>
                          <span>{file}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <i className="fas fa-database text-purple-400"></i>
                      <span>การเปลี่ยนแปลง Registry</span>
                    </h4>
                    <ul className="space-y-2">
                      {file.analysisResults.behaviors.registryChanges.map((reg, index) => (
                        <li key={index} className="text-sm text-white flex items-center space-x-2">
                          <i className="fas fa-caret-right text-cyan-400 text-xs"></i>
                          <span>{reg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <i className="fas fa-wifi text-blue-400"></i>
                    <span>การเรียกใช้ API</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {file.analysisResults.behaviors.apiCalls.map((api, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                        <i className="fas fa-code text-cyan-400 text-xs"></i>
                        <span className="text-white text-sm">{api}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Signatures Tab */}
            {activeTab === 'signatures' && (
              <div className="space-y-4">
                {file.analysisResults.signatures.map((signature, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{signature.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(signature.severity)}`}>
                        {signature.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-blue-200/60 text-sm">{signature.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Static Analysis Tab */}
            {activeTab === 'static' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Imports</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {file.analysisResults.staticAnalysis.imports.map((imp, index) => (
                      <div key={index} className="text-sm text-white bg-white/5 p-2 rounded-lg">
                        {imp}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-3">Suspicious Strings</h4>
                  <div className="space-y-2">
                    {file.analysisResults.staticAnalysis.strings.map((str, index) => (
                      <div key={index} className="text-sm text-white bg-white/5 p-2 rounded-lg font-mono">
                        {str}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional tabs for dynamic analysis and network would go here... */}
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      {emailDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-4">ส่งการแจ้งเตือนทางอีเมล</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  อีเมลผู้รับ
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSendEmail}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  ส่งอีเมล
                </button>
                <button
                  onClick={() => setEmailDialog(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}