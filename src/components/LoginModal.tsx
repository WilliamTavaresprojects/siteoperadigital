import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRegister: () => void;
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRegister,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const formattedEmail = email.trim().toLowerCase();
    
    if (
      (formattedEmail === 'operadigital.link@gmail.com' || formattedEmail === 'empwilliamtavares@gmail.com') && 
      password === 'inf4j61imc5f15'
    ) {
      setIsLogged(true);
    } else {
      setErrorMessage('E-mail ou senha incorretos. Acesso restrito ao administrador.');
    }
  };

  const handleQuickFill = () => {
    setEmail('operadigital.link@gmail.com');
    setPassword('inf4j61imc5f15');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B0F19] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-800 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isLogged ? (
          <div className="space-y-6">
            <div className="text-center">
              <img 
                src="https://i.ibb.co/SX9x8b4k/d943fc28-7ed1-4e07-a215-5630a4dea11d.jpg" 
                alt="Opera Digital Logo" 
                className="h-10 w-auto object-contain rounded-xl mx-auto mb-3 shadow-xs bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-xl font-bold text-white">
                Acesse sua conta Opera
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Digite seus dados de acesso ao painel de gestão
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  E-mail do Administrador
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="operadigital.link@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-300">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="text-[11px] text-blue-400 hover:underline font-semibold"
                  >
                    Preencher dados de acesso
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0A4EE4] hover:bg-blue-600 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Entrar no sistema</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-500 font-medium">
              Acesso exclusivo e restrito ao administrador credenciado.
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Login efetuado com sucesso!
            </h3>
            <p className="text-xs text-slate-400">
              Redirecionando para o seu painel de controle Opera Digital...
            </p>
            <button
              onClick={() => {
                onClose();
                if (onLoginSuccess) onLoginSuccess();
              }}
              className="bg-[#0A4EE4] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
            >
              Acessar Painel do Administrador
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
