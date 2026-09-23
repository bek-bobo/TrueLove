import React, { useState } from 'react';
import { Terminal, Server, Code, Shield, Cpu, Zap, Copy, Check } from 'lucide-react';
import { noirAudio } from '../utils/audioAmbience';

export const TechGuideView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    noirAudio.playKeyClick();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeSnippets = {
    eskizService: `// EskizSmsService.java - Eskiz.uz orqali SMS va bir martalik URL jo'natish
package uz.anonimus.service;

import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EskizSmsService {
    private static final String ESKIZ_URL = "https://notify.eskiz.uz/api/message/sms/send";
    private final HttpClient client = HttpClient.newHttpClient();

    public boolean sendSecretLetterSms(String phone, String token, String caseNumber) {
        // Bir martalik dosye havolasi
        String letterUrl = "https://anonimus-letter.onrender.com/d/" + token;
        String message = "Sizga maxfiy dosye keldi [" + caseNumber + "]. O'qish uchun: " + letterUrl;

        String jsonPayload = String.format(
            "{\\"mobile_phone\\": \\"%s\\", \\"message\\": \\"%s\\", \\"from\\": \\"4546\\"}",
            phone.replaceAll("[^0-9]", ""), message
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(ESKIZ_URL))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + getEskizToken())
            .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
            .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.statusCode() == 200;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String getEskizToken() {
        // Eskiz.uz /api/auth/login orqali olingan JWT token (Redis yoki keshda saqlanadi)
        return System.getenv("ESKIZ_BEARER_TOKEN");
    }
}`,

    renderDockerfile: `# Dockerfile - Render 512MB RAM uchun optimallashtirilgan Java konteyner
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY target/*.jar app.jar

# Render 512MB limitida OOM (Out Of Memory) bo'lmasligi uchun muhim JVM flaglar:
# 1. -XX:MaxRAMPercentage=75.0 (RAMning 75%idan oshmaydi)
# 2. -XX:+UseSerialGC (Eng kam xotira yeydigan Garbage Collector)
# 3. -Xss256k (Har bir thread stack hajmini kamaytirish)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC -Xss256k -Dfile.encoding=UTF-8"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]`,

    chatController: `// DossierChatController.java - Server-Sent Events (SSE) orqali yengil real-time anonim chat
package uz.anonimus.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.io.IOException;

@RestController
@RequestMapping("/api/chat")
public class DossierChatController {
    // Har bir maxfiy dosye ID si bo'yicha ulanishlar
    private final Map<String, SseEmitter> activeConnections = new ConcurrentHashMap<>();

    // Real-time oqimga ulanish (WebSocket o'rniga eng kam RAM yeydigan SSE)
    @GetMapping("/stream/{dossierToken}")
    public SseEmitter streamChat(@PathVariable String dossierToken) {
        SseEmitter emitter = new SseEmitter(600_000L); // 10 minut
        activeConnections.put(dossierToken, emitter);

        emitter.onCompletion(() -> activeConnections.remove(dossierToken));
        emitter.onTimeout(() -> activeConnections.remove(dossierToken));
        return emitter;
    }

    // Anonim xabar yuborish
    @PostMapping("/send/{dossierToken}")
    public Map<String, Object> sendMessage(
            @PathVariable String dossierToken,
            @RequestBody ChatPayload payload) {
        
        SseEmitter emitter = activeConnections.get(dossierToken);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                    .name("new_message")
                    .data(payload));
            } catch (IOException e) {
                activeConnections.remove(dossierToken);
            }
        }
        return Map.of("status", "DELIVERED");
    }
}`,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Introduction Header */}
      <div className="bg-[#181a21] border border-[#30281b] p-6 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-[#caa04b]">
          <Terminal className="w-4 h-4" />
          <span>JAVA & RENDER ARXITEKTURASI VA TAVSIYALAR</span>
        </div>
        <h2 className="text-xl font-bold font-serif-vintage text-[#f0e4cf] mt-1.5">
          &quot;Anonimus Letter&quot; Loyihasini Ishga Tushirish Bo&apos;yicha To&apos;liq Qo&apos;llanma
        </h2>
        <p className="text-xs text-[#a59784] mt-2 leading-relaxed">
          Siz so&apos;ragan talablar: <strong>Java dasturlash tili</strong>, <strong>Render serveri</strong>, <strong>Eskiz.uz SMS</strong> orqali bir martalik xabar yuborish, <strong>detektiv uslubidagi rasmga o&apos;xshash UI</strong>, <strong>anonim ikki tomonlama chat</strong> va <strong>eng kam resurs (RAM/CPU)</strong> sarflovchi arxitektura.
        </p>
      </div>

      {/* Section 1: Framework Tanlash */}
      <div className="bg-[#15171d] border border-[#2b251b] p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-case font-bold text-[#dfbe7e]">
          <Cpu className="w-4 h-4 text-[#caa04b]" />
          <span>1. Qaysi Java Framework eng ma&apos;qul? (Render 512MB RAM uchun)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Option A: Spring Boot 3 + HTMX */}
          <div className="p-4 rounded-xl bg-[#1b1e27] border border-[#caa04b]/40 relative">
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase mb-1">
              Eng Tavsiya Qilingan (Boshlanishiga)
            </div>
            <h4 className="font-bold text-sm text-[#f0e4cf]">Spring Boot 3 + HTMX</h4>
            <p className="mt-2 text-[#9f9382] leading-relaxed">
              <strong>MVC Monolit</strong>: alohida frontend server shart emas. Thymeleaf + HTMX yordamida sahifalar bevosita Java ichidan reaktiv yuklanadi.
            </p>
            <div className="mt-3 text-[11px] font-mono text-[#caa04b]">
              RAM: ~180MB - 240MB (Optimallashtirilgan)
            </div>
          </div>

          {/* Option B: Javalin */}
          <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d281f]">
            <div className="text-[10px] font-mono text-[#caa04b] font-bold uppercase mb-1">
              Ultra Yengil (Minimal RAM)
            </div>
            <h4 className="font-bold text-sm text-[#f0e4cf]">Javalin (Micro-framework)</h4>
            <p className="mt-2 text-[#9f9382] leading-relaxed">
              Javalin Jet-ning tepasida ishlaydi, hech qanday ortiqcha yuk yo&apos;q. 1 soniyada start oladi va Render bepul tarifida hech qachon xotiradan to&apos;lib to&apos;xtab qolmaydi.
            </p>
            <div className="mt-3 text-[11px] font-mono text-[#caa04b]">
              RAM: atigi ~40MB - 60MB!
            </div>
          </div>

          {/* Option C: Quarkus */}
          <div className="p-4 rounded-xl bg-[#12141a] border border-[#2d281f]">
            <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase mb-1">
              Cloud-Native / GraalVM
            </div>
            <h4 className="font-bold text-sm text-[#f0e4cf]">Quarkus (Native Image)</h4>
            <p className="mt-2 text-[#9f9382] leading-relaxed">
              GraalVM orqali native binary ga aylanadi. Juda tez yuklanadi va deyarli RAM yemaydi, biroq qurish (build) jarayoni biroz murakkabroq.
            </p>
            <div className="mt-3 text-[11px] font-mono text-[#caa04b]">
              RAM: ~25MB (Native rejimda)
            </div>
          </div>
        </div>

        <div className="bg-[#1f1d18] border border-[#caa04b]/30 p-3 rounded-xl text-xs text-[#d8cdb8] flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-[#caa04b] shrink-0 mt-0.5" />
          <div>
            <strong>Tavsiya xulosasi:</strong> Boshlanishiga <strong>Spring Boot 3 + HTMX + Tailwind CSS</strong> tanlang. MVC arxitekturasi bo&apos;lgani sababli bitta JAR fayl bo&apos;ladi, alohida Node.js yoki React deploy qilish kerak emas. Keyinchalik qismlarni kengaytirish juda qulay bo&apos;ladi.
          </div>
        </div>
      </div>

      {/* Section 2: Eskiz.uz SMS Service Code */}
      <div className="bg-[#15171d] border border-[#2b251b] p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-case font-bold text-[#dfbe7e]">
            <Code className="w-4 h-4 text-[#caa04b]" />
            <span>2. Eskiz.uz orqali bir martalik SMS yuborish (Java Kodi)</span>
          </div>
          <button
            onClick={() => handleCopy('eskiz', codeSnippets.eskizService)}
            className="px-3 py-1 bg-[#232631] text-xs font-mono rounded flex items-center gap-1.5 text-[#dcd1be] hover:bg-[#2d313f] cursor-pointer"
          >
            {copiedKey === 'eskiz' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'eskiz' ? 'Nusxalandi' : 'Nusxalash'}</span>
          </button>
        </div>

        <pre className="bg-[#0b0c10] p-3.5 rounded-xl border border-[#232019] text-[11px] font-mono text-[#d1c5b0] overflow-x-auto">
          {codeSnippets.eskizService}
        </pre>
      </div>

      {/* Section 3: Render Dockerfile & JVM Memory Tuning */}
      <div className="bg-[#15171d] border border-[#2b251b] p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-case font-bold text-[#dfbe7e]">
            <Server className="w-4 h-4 text-[#caa04b]" />
            <span>3. Render.com ga deploy qilish va 512MB RAM ni tejash (Dockerfile)</span>
          </div>
          <button
            onClick={() => handleCopy('docker', codeSnippets.renderDockerfile)}
            className="px-3 py-1 bg-[#232631] text-xs font-mono rounded flex items-center gap-1.5 text-[#dcd1be] hover:bg-[#2d313f] cursor-pointer"
          >
            {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'docker' ? 'Nusxalandi' : 'Nusxalash'}</span>
          </button>
        </div>

        <p className="text-xs text-[#a59784]">
          Render free tier faqat 512MB xotira beradi. Agar standart JVM ishga tushirilsa, u 600-700MB so&apos;rab Render tomonidan o&apos;chirib yuborilishi mumkin (OOM Killed). Quyidagi flaglar buning oldini oladi:
        </p>

        <pre className="bg-[#0b0c10] p-3.5 rounded-xl border border-[#232019] text-[11px] font-mono text-[#d1c5b0] overflow-x-auto">
          {codeSnippets.renderDockerfile}
        </pre>
      </div>

      {/* Section 4: Anonymous Chat Architecture */}
      <div className="bg-[#15171d] border border-[#2b251b] p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-case font-bold text-[#dfbe7e]">
            <Shield className="w-4 h-4 text-[#caa04b]" />
            <span>4. Ikki tomonlama Anonim Chat arxitekturasi (SSE / WebSockets)</span>
          </div>
          <button
            onClick={() => handleCopy('chat', codeSnippets.chatController)}
            className="px-3 py-1 bg-[#232631] text-xs font-mono rounded flex items-center gap-1.5 text-[#dcd1be] hover:bg-[#2d313f] cursor-pointer"
          >
            {copiedKey === 'chat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'chat' ? 'Nusxalandi' : 'Nusxalash'}</span>
          </button>
        </div>

        <div className="text-xs text-[#a59784] space-y-1.5">
          <p>
            • <strong>Qabul qiluvchi:</strong> SMS dagi bir martalik havola orqali kiradi (masalan: <code>/d/delo-05-a89b</code>).
          </p>
          <p>
            • <strong>Yuboruvchi:</strong> Xat yaratilganda beriladigan Maxfiy Kalit (Secret Author Key) orqali kiradi va javoblarni kuzatadi.
          </p>
          <p>
            • <strong>Nega SSE (Server-Sent Events)?</strong> WebSockets ga qaraganda SSE oddiy HTTP protokoli orqali ishlaydi, Render bepul tarifida proksi orqali uzilib qolmaydi va RAMni 3 barobar kam sarflaydi!
          </p>
        </div>

        <pre className="bg-[#0b0c10] p-3.5 rounded-xl border border-[#232019] text-[11px] font-mono text-[#d1c5b0] overflow-x-auto">
          {codeSnippets.chatController}
        </pre>
      </div>

      {/* Section 5: Media Storage without Amazon S3 & Telegram Bot */}
      <div className="bg-[#15171d] border border-cyan-800/40 p-5 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-sm font-case font-bold text-cyan-300">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>5. Amazon S3 siz Rasm va Ovozli Xabarlarni qayerda saqlash mumkin?</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#cfc2ae]">
          {/* Solution 1: Cloudinary / Supabase Storage */}
          <div className="p-3.5 bg-black/40 rounded-xl border border-cyan-600/30 space-y-1.5">
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
              1. Cloudinary / Supabase (Bepul 25 GB)
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              <strong>Eng oson va sifatli yo&apos;l:</strong> Cloudinary har oy bepul 25 GB transfer beradi. Rasm yuklanganda avtomatik siqib (compress), vintage sepia/noir filtrini ham o&apos;zi qo&apos;yib beradi. Java SDK si 3 qator kod bilan ulanadi.
            </p>
          </div>

          {/* Solution 2: Telegram Bot Storage (Foydalanuvchi aytgan g'oya) */}
          <div className="p-3.5 bg-black/40 rounded-xl border border-emerald-600/30 space-y-1.5">
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
              2. Telegram Botni Bepul CDN Qilish
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              <strong>Cheksiz bepul ombor:</strong> Foydalanuvchi rasm yoki ovoz yuborganda, Java backend uni sizning maxfiy Telegram kanalingizga (yoki botga) <code>sendPhoto</code>/<code>sendVoice</code> orqali otadi. Telegram qaytargan <code>file_id</code> orqali bepul stream qilib beraverasiz. S3 umuman kerak emas!
            </p>
          </div>

          {/* Solution 3: Render Sleep & Keep-Alive */}
          <div className="p-3.5 bg-black/40 rounded-xl border border-amber-600/30 space-y-1.5">
            <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
              3. Render Bepul Serverini &quot;Uxlatmaslik&quot;
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              Render free tier 15 minutdan so&apos;ng <strong>uxlab qoladi</strong> (uyg&apos;onishi 50 soniya cho&apos;zilishi mumkin). Telegram bot yoki <strong>UptimeRobot / Cron-Job.org</strong> orqali har 10 minutda serveringizning <code>/api/health</code> endpointiga bepul ping yuborib tursangiz, server 24/7 uyg&apos;oq va tezkor ishlaydi!
            </p>
          </div>
        </div>
      </div>

      {/* Extra Feature Ideas Box */}
      <div className="bg-gradient-to-br from-[#1a1712] to-[#252016] border border-[#caa04b]/40 p-5 rounded-2xl space-y-4">
        <h4 className="text-sm font-case font-bold text-[#f0e4cf] flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-[#caa04b]" />
          <span>6. Biznes Modeli, Monetizatsiya va Virallik (Business Flow)</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#cfc2ae]">
          <div className="p-3.5 bg-black/40 rounded-xl border border-emerald-500/30 space-y-1.5">
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center justify-between">
              <span>1. Halol Mikro-To&apos;lov &amp; Anti-Scam Himoyasi</span>
              <span className="text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">Xavfsiz</span>
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              <strong>Firibgarlik shubhasini oldini olish:</strong> SMS ichida bank kartasi, kod yoki to&apos;lov havolasi aslo yuborilmaydi! Qabul qiluvchi mutlaqo <strong>1 tiyin ham to&apos;lamaydi</strong> (barcha to&apos;lov xatni yozgan muallif tomonidan oldindan qilinadi). SMS faqat estetik shaxsiy xat havolasini olib keladi. Rasmiy Eskiz Alpha-Name orqali xavfsiz jo&apos;natiladi.
            </p>
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-[#caa04b]/20 space-y-1.5">
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase">
              2. Organik Viral Zanjir (K-Faktor)
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              Qabul qiluvchi xatni o&apos;qib hayratga tushgach, sahifa pastida taklif chiqadi: <em>&quot;Siz ham o&apos;z siringizni kimgadir jo&apos;natmoqchimisiz?&quot;</em>. Natijada har 1 ta yuborilgan xat 2-3 ta yangi to&apos;lovchi foydalanuvchini olib keladi.
            </p>
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-[#caa04b]/20 space-y-1.5">
            <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
              3. Chang bosgan Arxiv Fotosuratlari (Puflab tozalash)
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              Xronologiya dosyesidagi fotosuratlar ustini arxiv changi qoplaydi. Barmog&apos;i yoki sichqoncha bilan bosilganda haqiqiy shivir-shivir ovoz bilan chang uchib ketadi va yorqin fotodalil ochiladi.
            </p>
          </div>

          <div className="p-3.5 bg-black/40 rounded-xl border border-[#caa04b]/20 space-y-1.5">
            <div className="text-[11px] font-mono text-purple-400 font-bold uppercase">
              4. Premium Detektiv Qo&apos;shimchalari
            </div>
            <p className="text-[11px] text-[#a99c89] leading-relaxed">
              Pullik qo&apos;shimcha optsiyalar: 30 soniyali anonim audio kassetasi (shovqinli magnitafon ovozi), qizil siyohli maxsus monogramma muhrlari va o&apos;z-o&apos;zini yoqib yuborish taymeri.
            </p>
          </div>
        </div>

        {/* Next-Level Creative Features (Yangi g'oyalar) */}
        <div className="mt-4 pt-3 border-t border-[#caa04b]/20">
          <div className="text-xs font-case font-bold text-[#ffd977] mb-2 uppercase tracking-wider">
            💡 Loyihani yanada yondiradigan 4 ta yangi g&apos;oya:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-[#b8ab97]">
            <div className="bg-black/30 p-2.5 rounded-lg border border-amber-500/20">
              <strong className="text-amber-300">1. Qalam va Shisha Chiroq (Simulated Match Flame):</strong> Foydalanuvchi ekranda gugurt chaqib xatdagi ko&apos;rinmas siyohni (lemon juice ink) isitib o&apos;qiydi.
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-cyan-500/20">
              <strong className="text-cyan-300">2. Interaktiv Telefon Qo&apos;ng&apos;irog&apos;i (IVR):</strong> Xat ichidagi maxfiy raqamga bosilganda detektiv trubka ovozi va shivirlagan audio eshitiladi.
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-emerald-500/20">
              <strong className="text-emerald-300">3. Kuryer Telegram Bot:</strong> Muallif uchun Telegram bot — qabul qiluvchi xatni qachon ochgani va nima deb javob yozganini darhol botga push qilib bildiradi.
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-rose-500/20">
              <strong className="text-rose-300">4. &quot;Bir vaqtda ochish&quot; (Synchronized Opening):</strong> Ikkala tomon belgilangan vaqtda (masalan, 23:00 da) bir vaqtning o&apos;zida muhrni sindiradi.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
