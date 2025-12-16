import CVForm from '@/CVForm/CVForm';
import { Card, CardContent } from '../components/UI/Card';
import { Download, Eye } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Professional CV Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Create a beautiful, professional CV in minutes. Fill in your details and download as PDF.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Fill Your Information</h2>
            </div>
            <CVForm />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-green-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
            </div>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                    <Eye className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Preview Your CV</h3>
                    <p className="text-gray-600 mb-6">
                      See how your CV will look before downloading
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                    <Download className="w-10 h-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Download as PDF</h3>
                    <p className="text-gray-600 mb-6">
                      Get a print-ready PDF version of your CV
                    </p>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-5 h-5" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">Tips for a Great CV</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Keep your summary concise and impactful</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Use action verbs to describe your experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Quantify achievements with numbers when possible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>Tailor your CV for each job application</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}