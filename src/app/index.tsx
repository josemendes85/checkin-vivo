import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { PulseRings } from '@/components/PulseRings';

// Design system colors matching prototype.html
const COLORS = {
  bgPage: '#E9EDE2',
  bgApp: '#F4F6EF',
  ink: '#1C3229',
  inkSoft: '#56695D',
  inkFaint: '#8B9A8B',
  card: '#FFFFFF',
  line: '#DFE5D6',
  gold: '#DFA13A',
  goldDeep: '#B87F22',
  goldPale: '#F7E9D0',
  coral: '#E15A3E',
  coralPale: '#FBE2DB',
};

const STORAGE_KEY = '@estou_bem_state_v2';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'contato' | 'alerta'>('home');
  
  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'google' | 'phone' | null>(null);
  
  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // App states
  const [userName, setUserName] = useState('Marina');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState('hoje às 08:12');
  const [countdownText, setCountdownText] = useState('em 23h 48min — sem pressa');
  const [progressFill, setProgressFill] = useState(0.22); // 22%
  
  // Contact states (Caregiver)
  const [contactName, setContactName] = useState('Ana Souza');
  const [contactPhone, setContactPhone] = useState('62981462420'); // Default test number requested by user
  const [contactRelation, setContactRelation] = useState('Filho(a)');
  const [alertChannel, setAlertChannel] = useState('WhatsApp');
  const [inviteSent, setInviteSent] = useState(false);
  
  // Alert/Simulations states
  const [waChecked, setWaChecked] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('Convite enviado ✓');

  // Load state on startup
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          const state = JSON.parse(jsonValue);
          if (state.isLoggedIn !== undefined) setIsLoggedIn(state.isLoggedIn);
          if (state.loginMethod) setLoginMethod(state.loginMethod);
          if (state.userName) setUserName(state.userName);
          if (state.isConfirmed !== undefined) setIsConfirmed(state.isConfirmed);
          if (state.lastCheckIn) setLastCheckIn(state.lastCheckIn);
          if (state.countdownText) setCountdownText(state.countdownText);
          if (state.progressFill !== undefined) setProgressFill(state.progressFill);
          if (state.contactName) setContactName(state.contactName);
          if (state.contactPhone) setContactPhone(state.contactPhone);
          if (state.contactRelation) setContactRelation(state.contactRelation);
          if (state.alertChannel) setAlertChannel(state.alertChannel);
          if (state.inviteSent !== undefined) setInviteSent(state.inviteSent);
          if (state.waChecked !== undefined) setWaChecked(state.waChecked);
        }
      } catch (e) {
        console.error('Error loading state from AsyncStorage', e);
      }
    };
    loadSavedState();
  }, []);

  // Save state whenever it changes
  const saveAppState = async (updatedFields: any) => {
    try {
      const currentStateJson = await AsyncStorage.getItem(STORAGE_KEY);
      const currentState = currentStateJson ? JSON.parse(currentStateJson) : {};
      const newState = { ...currentState, ...updatedFields };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error('Error saving state to AsyncStorage', e);
    }
  };

  // Google Login Simulation
  const handleGoogleLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setIsLoggedIn(true);
      setLoginMethod('google');
      setUserName('Marina'); // Default name for Google login simulation
      saveAppState({
        isLoggedIn: true,
        loginMethod: 'google',
        userName: 'Marina',
      });
    }, 1200);
  };

  // Phone Login Simulation
  const handlePhoneLogin = () => {
    if (!regName.trim()) {
      setToastText('Por favor, informe seu nome.');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }
    if (regPhone.trim().length < 8) {
      setToastText('Informe um telefone válido.');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }

    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setIsLoggedIn(true);
      setLoginMethod('phone');
      setUserName(regName);
      saveAppState({
        isLoggedIn: true,
        loginMethod: 'phone',
        userName: regName,
      });
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMethod(null);
    setRegName('');
    setRegPhone('');
    saveAppState({
      isLoggedIn: false,
      loginMethod: null,
    });
  };

  const handleCheckIn = () => {
    if (isConfirmed) return;

    // Validation: Require caregiver contact to be set
    if (!contactPhone || contactPhone.trim() === '') {
      setToastText('Configure seu contato primeiro!');
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      setCurrentTab('contato');
      return;
    }

    setIsConfirmed(true);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `hoje às ${hh}:${mm}`;
    
    setLastCheckIn(timeStr);
    setCountdownText('em 23h 59min — sem pressa');
    setProgressFill(0.02); // 2%

    saveAppState({
      isConfirmed: true,
      lastCheckIn: timeStr,
      countdownText: 'em 23h 59min — sem pressa',
      progressFill: 0.02,
    });

    // Active Caregiver Alert: Send real WhatsApp message to caregiver
    // Format caregiver phone number
    let cleanedPhone = contactPhone.replace(/\D/g, '');
    if (cleanedPhone.length === 10 || cleanedPhone.length === 11) {
      cleanedPhone = '55' + cleanedPhone; // Prepend Brazil country code if not present
    }
    
    const messageText = `Olá ${contactName.split(' ')[0]}! Estou passando para avisar que estou bem hoje (confirmado às ${hh}:${mm}). 👍`;
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(messageText)}`;

    // Open WhatsApp
    Linking.openURL(whatsappUrl).catch((err) => {
      console.error('Failed to open WhatsApp URL', err);
    });

    // Auto-revert after 4 seconds for interactive prototype simulation purposes
    setTimeout(() => {
      setIsConfirmed(false);
      saveAppState({ isConfirmed: false });
    }, 4000);
  };

  const handleSendInvite = () => {
    setInviteSent(true);
    setToastText('Convite enviado ✓');
    setToastVisible(true);
    saveAppState({ inviteSent: true });

    // Send WhatsApp invitation message
    if (alertChannel === 'WhatsApp' && contactPhone) {
      let cleanedPhone = contactPhone.replace(/\D/g, '');
      if (cleanedPhone.length === 10 || cleanedPhone.length === 11) {
        cleanedPhone = '55' + cleanedPhone;
      }
      
      const message = `Olá! Gostaria de convidar você para ser meu contato de confiança no aplicativo Estou Bem. Você receberá um aviso pelo WhatsApp se eu não confirmar que estou bem a tempo. Aceita me ajudar?`;
      const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
      
      Linking.openURL(url).catch((err) => {
        console.error('Failed to open WhatsApp URL', err);
      });
    }

    setTimeout(() => {
      setToastVisible(false);
    }, 2200);
  };

  const toggleWaChecked = () => {
    const nextState = !waChecked;
    setWaChecked(nextState);
    saveAppState({ waChecked: nextState });
  };

  const updateContactRelation = (relation: string) => {
    setContactRelation(relation);
    saveAppState({ contactRelation: relation });
  };

  const updateAlertChannel = (channel: string) => {
    setAlertChannel(channel);
    saveAppState({ alertChannel: channel });
  };

  const handleNameChange = (text: string) => {
    setContactName(text);
    saveAppState({ contactName: text });
    if (inviteSent) {
      setInviteSent(false);
      saveAppState({ inviteSent: false, contactName: text });
    }
  };

  const handlePhoneChange = (text: string) => {
    setContactPhone(text);
    saveAppState({ contactPhone: text });
    if (inviteSent) {
      setInviteSent(false);
      saveAppState({ inviteSent: false, contactPhone: text });
    }
  };

  // ============ RENDER LOGIN / ONBOARDING SCREEN ============
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgApp} />
        <ScrollView contentContainerStyle={styles.authScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.authHeader}>
            <Text style={styles.authLogo}>estou bem</Text>
            <Text style={styles.authSub}>Sua segurança e a tranquilidade de quem você ama, a um toque.</Text>
          </View>

          {authLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.ink} />
              <Text style={styles.loadingText}>Acessando...</Text>
            </View>
          ) : (
            <View style={styles.authCard}>
              <Text style={styles.authTitle}>Para começar, crie sua conta</Text>
              
              {/* Google login button */}
              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8} onPress={handleGoogleLogin}>
                <View style={styles.googleIconContainer}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleBtnText}>Cadastrar com o Google</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou cadastrar por telefone</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Phone login fields */}
              <Text style={styles.fieldLabel}>Seu Nome</Text>
              <TextInput
                style={styles.field}
                value={regName}
                onChangeText={setRegName}
                placeholder="Ex: Marina Souza"
                placeholderTextColor={COLORS.inkFaint}
              />

              <Text style={styles.fieldLabel}>Seu Celular (WhatsApp)</Text>
              <TextInput
                style={styles.field}
                value={regPhone}
                onChangeText={setRegPhone}
                placeholder="Ex: 62981462420"
                placeholderTextColor={COLORS.inkFaint}
                keyboardType="phone-pad"
              />

              <TouchableOpacity style={styles.phoneSubmitBtn} activeOpacity={0.9} onPress={handlePhoneLogin}>
                <Text style={styles.phoneSubmitText}>Criar Conta com Telefone</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.authFooter}>
            <Text style={styles.authFooterText}>App Estou Bem — Inspirado no modelo de check-in de segurança ativa.</Text>
          </View>
        </ScrollView>
        {toastVisible && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastText}</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ============ RENDER MAIN APP SCREEN ============
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgApp} />
      
      <View style={styles.viewPort}>
        {/* ============ TAB 1: INÍCIO ============ */}
        {currentTab === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.greetingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Bom dia</Text>
                <Text style={styles.pageTitle}>Olá, {userName}</Text>
              </View>
              <View style={styles.headerActionRow}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                  <Text style={styles.logoutBtnText}>🚪 Sair</Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={['#DFA13A', '#B87F22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.pageSub}>Segunda-feira, 6 de julho</Text>

            <PulseRings isConfirmed={isConfirmed}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.touchArea}
                onPress={handleCheckIn}
              >
                {isConfirmed ? (
                  <LinearGradient
                    colors={['#EAF3E4', '#CFE3C2', '#8FB47B']}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.lifeBtn, styles.lifeBtnDone]}
                  >
                    <Text style={[styles.btnBig, styles.btnBigDone]}>Confirmado</Text>
                    <Text style={[styles.btnSmall, styles.btnSmallDone]}>cuidadora avisada!</Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={['#F3C570', '#DFA13A', '#B87F22']}
                    locations={[0, 0.55, 1]}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.lifeBtn}
                  >
                    <Text style={styles.btnBig}>Estou bem</Text>
                    <Text style={styles.btnSmall}>toque para avisar</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </PulseRings>

            <Text style={styles.statusLine}>
              Último check-in: <Text style={styles.statusLineBold}>{lastCheckIn}</Text>
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Aviso ativo de bem-estar</Text>
              <Text style={styles.cardText}>
                Ao tocar no botão acima, abriremos o WhatsApp para enviar o aviso de confirmação à cuidadora abaixo.
              </Text>
            </View>

            <View style={[styles.card, styles.cardRow]}>
              <View style={styles.chipIcon}>
                <Text style={{ fontSize: 16 }}>💚</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{contactName.split(' ')[0]} ({contactRelation.toLowerCase()}) receberá o aviso</Text>
                <Text style={styles.cardText}>
                  Telefone cadastrado: {contactPhone || 'Não configurado'}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* ============ TAB 2: CONTATO ============ */}
        {currentTab === 'contato' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>Passo 2 de 2</Text>
            <Text style={styles.pageTitle}>Seu contato de confiança</Text>
            <Text style={styles.pageSub}>
              Essa pessoa receberá suas confirmações de bem-estar ou alertas se você não responder.
            </Text>

            <Text style={styles.fieldLabel}>Nome do Contato/Cuidador</Text>
            <TextInput
              style={styles.field}
              value={contactName}
              onChangeText={handleNameChange}
              placeholder="Nome do contato"
              placeholderTextColor={COLORS.inkFaint}
            />

            <Text style={styles.fieldLabel}>Telefone (WhatsApp)</Text>
            <TextInput
              style={styles.field}
              value={contactPhone}
              onChangeText={handlePhoneChange}
              placeholder="Ex: 62981462420"
              placeholderTextColor={COLORS.inkFaint}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Relação</Text>
            <View style={styles.chipRow}>
              {['Cônjuge', 'Filho(a)', 'Amigo(a)', 'Cuidador(a)'].map((rel) => {
                const isSelected = contactRelation === rel;
                return (
                  <TouchableOpacity
                    key={rel}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => updateContactRelation(rel)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {rel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>Canal do alerta</Text>
            <View style={styles.toggleRow}>
              {['WhatsApp', 'SMS'].map((chan) => {
                const isSelected = alertChannel === chan;
                return (
                  <TouchableOpacity
                    key={chan}
                    style={[styles.toggle, isSelected && styles.toggleSelected]}
                    onPress={() => updateAlertChannel(chan)}
                  >
                    <Text style={[styles.toggleText, isSelected && styles.toggleTextSelected]}>
                      {chan}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.invitePreview}>
              <Text style={styles.invitePreviewText}>
                💬 {contactName ? contactName.split(' ')[0] : 'O contato'} receberá um convite para aceitar o papel de cuidador, ativando os alertas automatizados.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, inviteSent && styles.primaryBtnSent]}
              onPress={handleSendInvite}
            >
              <Text style={styles.primaryBtnText}>
                {inviteSent ? 'Convite enviado ✓' : `Enviar convite para ${contactName ? contactName.split(' ')[0] : 'Ana'}`}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ============ TAB 3: ALERTA ============ */}
        {currentTab === 'alerta' && (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.eyebrow}>Se o prazo vencer</Text>
            <Text style={styles.pageTitle}>Mensagem de Alerta</Text>
            <Text style={styles.pageSub}>Simulação do alerta automático se você não confirmar presença.</Text>

            <View style={styles.waMock}>
              <View style={styles.waHeader}>
                <View style={styles.waAvatar}>
                  <Text style={styles.waAvatarText}>EB</Text>
                </View>
                <View>
                  <Text style={styles.waHeaderName}>Estou Bem</Text>
                  <Text style={styles.waHeaderSub}>conta oficial</Text>
                </View>
              </View>
              <View style={styles.waBody}>
                <View style={styles.waBubble}>
                  <Text style={styles.waBubbleText}>
                    🔔 <Text style={{ fontWeight: 'bold' }}>{userName}</Text> não confirmou presença hoje. Último sinal: {lastCheckIn}.
                    {'\n\n'}Por favor, verifique se está tudo bem com ela.
                  </Text>
                  <Text style={styles.waTime}>08:47</Text>
                </View>
                
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.waCta, waChecked && styles.waCtaChecked]}
                  onPress={toggleWaChecked}
                >
                  <Text style={[styles.waCtaText, waChecked && styles.waCtaTextChecked]}>
                    {waChecked ? `Verificado por ${contactName ? contactName.split(' ')[0] : 'Ana'} ✓` : 'Marcar como verificado'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeline}>
              <View style={styles.tlItem}>
                <View style={[styles.tlDot, styles.tlDotDone]}>
                  <Text style={styles.tlDotTextDone}>✓</Text>
                </View>
                <View style={styles.tlContent}>
                  <Text style={styles.tlTitle}>Lembrete enviado à {userName}</Text>
                  <Text style={styles.tlText}>30 min antes do prazo — push no celular</Text>
                </View>
              </View>

              <View style={styles.tlItem}>
                <View style={[styles.tlDot, styles.tlDotDone]}>
                  <Text style={styles.tlDotTextDone}>✓</Text>
                </View>
                <View style={styles.tlContent}>
                  <Text style={styles.tlTitle}>Prazo de segurança esgotado</Text>
                  <Text style={styles.tlText}>Nenhum check-in registrado dentro das últimas 24h</Text>
                </View>
              </View>

              <View style={[styles.tlItem, { marginBottom: 0 }]}>
                <View style={[styles.tlDot, styles.tlDotAlert]}>
                  <Text style={styles.tlDotTextAlert}>!</Text>
                </View>
                <View style={styles.tlContent}>
                  <Text style={styles.tlTitle}>Mensagem de emergência disparada</Text>
                  <Text style={styles.tlText}>Notificação enviada para {contactName} via {alertChannel}</Text>
                </View>
              </View>
              <View style={styles.tlLine} />
            </View>
          </ScrollView>
        )}
      </View>

      {/* Toast Notification */}
      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastText}</Text>
        </View>
      )}

      {/* Navigation TabBar */}
      <View style={styles.tabbar}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'home' && styles.tabActive]}
          onPress={() => setCurrentTab('home')}
        >
          <View style={[styles.tabDot, currentTab === 'home' && styles.tabDotActive]} />
          <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentTab === 'contato' && styles.tabActive]}
          onPress={() => setCurrentTab('contato')}
        >
          <View style={[styles.tabDot, currentTab === 'contato' && styles.tabDotActive]} />
          <Text style={[styles.tabLabel, currentTab === 'contato' && styles.tabLabelActive]}>
            Contato
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, currentTab === 'alerta' && styles.tabActive]}
          onPress={() => setCurrentTab('alerta')}
        >
          <View style={[styles.tabDot, currentTab === 'alerta' && styles.tabDotActive]} />
          <Text style={[styles.tabLabel, currentTab === 'alerta' && styles.tabLabelActive]}>
            Alerta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },
  viewPort: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
  },
  logoutBtnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: COLORS.inkSoft,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontFamily: 'Fraunces_700Bold',
    fontSize: 16,
  },
  eyebrow: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: COLORS.goldDeep,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 26,
    lineHeight: 30,
    color: COLORS.ink,
    marginVertical: 2,
  },
  pageSub: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13.5,
    color: COLORS.inkSoft,
    marginBottom: 18,
  },
  touchArea: {
    width: '46%',
    aspectRatio: 1,
    borderRadius: 9999,
  },
  lifeBtn: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: COLORS.goldDeep,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 15,
    elevation: 8,
  },
  lifeBtnDone: {
    shadowColor: '#5A8C46',
    shadowOpacity: 0.5,
  },
  btnBig: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 19,
    color: '#3A2506',
    textAlign: 'center',
  },
  btnBigDone: {
    color: '#2C4A22',
  },
  btnSmall: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#6B4A10',
    marginTop: 4,
    textAlign: 'center',
  },
  btnSmallDone: {
    color: '#3F6431',
  },
  statusLine: {
    textAlign: 'center',
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: COLORS.inkSoft,
    marginVertical: 16,
  },
  statusLineBold: {
    fontFamily: 'Manrope_700Bold',
    color: COLORS.ink,
  },
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13.5,
    color: COLORS.ink,
    marginBottom: 2,
  },
  cardText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12.5,
    color: COLORS.inkSoft,
    lineHeight: 18,
  },
  progressTrack: {
    height: 8,
    borderRadius: 6,
    backgroundColor: COLORS.line,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  chipIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.goldPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Contato screen styles
  fieldLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: COLORS.inkSoft,
    marginTop: 14,
    marginBottom: 6,
  },
  field: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: COLORS.ink,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
  },
  chipSelected: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.ink,
  },
  chipText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12.5,
    color: COLORS.inkSoft,
  },
  chipTextSelected: {
    color: COLORS.bgApp,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.card,
  },
  toggleSelected: {
    backgroundColor: COLORS.goldPale,
    borderColor: COLORS.goldDeep,
  },
  toggleText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 12.5,
    color: COLORS.inkSoft,
  },
  toggleTextSelected: {
    color: COLORS.goldDeep,
  },
  invitePreview: {
    marginTop: 16,
    backgroundColor: COLORS.goldPale,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.goldDeep,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  invitePreviewText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: '#6B4A10',
    lineHeight: 17,
  },
  primaryBtn: {
    width: '100%',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnSent: {
    backgroundColor: '#4C7A3B',
  },
  primaryBtnText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 14,
    color: COLORS.bgApp,
  },

  // Alerta screen styles
  waMock: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.line,
    marginTop: 6,
  },
  waHeader: {
    backgroundColor: '#1C3229',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waAvatarText: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 13,
    color: '#3A2506',
  },
  waHeaderName: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13.5,
    color: COLORS.bgApp,
  },
  waHeaderSub: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 10.5,
    color: '#C7D4C4',
  },
  waBody: {
    backgroundColor: '#F3EFE3',
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  waBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderTopLeftRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '92%',
  },
  waBubbleText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: COLORS.ink,
    lineHeight: 20,
  },
  waTime: {
    textAlign: 'right',
    fontFamily: 'Manrope_500Medium',
    fontSize: 10,
    color: '#9AA79B',
    marginTop: 4,
  },
  waCta: {
    marginTop: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORS.goldPale,
    borderWidth: 1,
    borderColor: COLORS.goldDeep,
    alignSelf: 'flex-start',
  },
  waCtaChecked: {
    backgroundColor: '#DCEBD3',
    borderColor: '#4C7A3B',
  },
  waCtaText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 12,
    color: COLORS.goldDeep,
  },
  waCtaTextChecked: {
    color: '#345C27',
  },
  timeline: {
    marginTop: 20,
    position: 'relative',
  },
  tlLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: 20,
    width: 1.5,
    backgroundColor: COLORS.line,
    zIndex: 1,
  },
  tlItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    zIndex: 2,
  },
  tlDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: {
    backgroundColor: COLORS.goldPale,
    borderColor: COLORS.goldDeep,
  },
  tlDotAlert: {
    backgroundColor: COLORS.coralPale,
    borderColor: COLORS.coral,
  },
  tlDotTextDone: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: COLORS.goldDeep,
    lineHeight: 12,
  },
  tlDotTextAlert: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: COLORS.coral,
    lineHeight: 12,
  },
  tlContent: {
    flex: 1,
  },
  tlTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: COLORS.ink,
  },
  tlText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 11.5,
    color: COLORS.inkSoft,
    marginTop: 2,
  },
  
  // Toast styles
  toast: {
    position: 'absolute',
    bottom: 80,
    left: '50%',
    transform: [{ translateX: -90 }], // Simple centering on width ~180
    backgroundColor: COLORS.ink,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    zIndex: 9999,
  },
  toastText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12.5,
    color: COLORS.bgApp,
    textAlign: 'center',
  },

  // TabBar styles
  tabbar: {
    height: 72,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.bgApp,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  tabActive: {
    backgroundColor: COLORS.goldPale,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inkFaint,
    marginBottom: 4,
  },
  tabDotActive: {
    backgroundColor: COLORS.goldDeep,
    transform: [{ scale: 1.2 }],
  },
  tabLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11.5,
    color: COLORS.inkFaint,
  },
  tabLabelActive: {
    color: COLORS.ink,
  },

  // ONBOARDING / AUTH SCREEN STYLES
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
  },
  authScroll: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authLogo: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 34,
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  authSub: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14.5,
    color: COLORS.inkSoft,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  authCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  authTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 20,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  googleIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  googleBtnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: COLORS.ink,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.line,
  },
  dividerText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.inkSoft,
    marginHorizontal: 12,
  },
  phoneSubmitBtn: {
    backgroundColor: COLORS.ink,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  phoneSubmitText: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 14,
    color: COLORS.bgApp,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: COLORS.inkSoft,
    marginTop: 12,
  },
  authFooter: {
    alignItems: 'center',
    marginTop: 32,
  },
  authFooterText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 11,
    color: COLORS.inkFaint,
    textAlign: 'center',
    lineHeight: 16,
  },
});
