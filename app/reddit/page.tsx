"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Történet tároló kategóriánként
const storyData: Record<string, string[]> = {
  "Scary Encounter": [
    "I woke up to footsteps in the hallway. I called out for my roommate but no one answered. The footsteps stopped right outside my door. The handle began to twist slowly. I held my breath and stayed still. Then the steps started running toward my bed.",
"I passed an old playground at night. One swing moved on its own in total stillness. When I walked by, it stopped completely. I heard breathing right beside my ear. A whisper asked me to push the swing. I ran without looking back.",
"My phone buzzed at 3 AM with a message from my mom asking me to come downstairs. She was already sitting on the couch when I arrived. She asked why I texted her. We both looked at our phones and saw the same message. Then another text arrived saying do not trust her. We did not sleep again that night.",
"Every night something scratched inside my walls. The scratching became knocking. Then I heard my name being whispered from behind the plaster. I smashed a panel open but nothing was inside. The whispers moved to right behind my head. I have not slept since.",
"I picked up a hitchhiker during a storm. He sat in silence behind me. When I glanced in the mirror he disappeared. The door never opened. When I reached home someone knocked from inside my car. I never checked who it was.",
"I worked late and took the elevator alone. The lights flickered and went out. I felt someone standing next to me. A cold hand brushed my arm. When the lights came back the elevator was empty except for a single wet footprint. The elevator dinged and opened to a dark hallway.",
"The dog I was watching barked every night at the basement door. On the fourth night he suddenly stopped. I opened the door to look. The light in the basement switched on by itself. Something whispered close to my face telling me to close it. I locked every door.",
"I heard a child giggling in the hotel room next to mine. The front desk said no one was staying on that entire floor. The giggles became footsteps running back and forth. Then a tap sounded on my door. A little voice said let me in. I left the hotel immediately.",
"I bought an old journal from a yard sale. Each morning it had new writing inside describing my dreams. One entry predicted I would die soon. The next day the page was missing. That night a voice whispered that my time was up. I no longer keep journals.",
"My nephew spoke to an imaginary friend in my guest room. One night I asked the friend’s name. My nephew froze and went pale. He said I already knew him. I suddenly felt someone behind me. I no longer let him play in that room.",
"I lit candles when the power went out. Shadows stretched unnaturally across the walls. One of them did not match anything in the room. It stood up and moved toward me. The candle blew out without wind. The room was too quiet after that.",
"I heard my sister calling from the kitchen. She stood at the stove when I walked in. I touched her shoulder and she turned with a face that was wrong and twisted. A moment later the front door opened. My real sister walked in with groceries. I did not look back.",
"I lived near tracks and thought the nightly sound was a passing train. One night I heard screaming mixed into it. The news reported no trains ran that night. The next night the screaming returned louder. I realized it was something running past my house. I never opened the curtains again.",
"My baby monitor flickered to life at midnight. Instead of my daughter I saw a fog filled room. A shadow leaned over the crib and whispered to her. I ran to her bedroom and found her sleeping alone. The monitor turned off by itself. I still do not know what leaned over her.",
"I found a music box in the attic. It played a tune I had never heard. That night it began playing downstairs. In the morning it lay beside my pillow. The wood felt warm as if someone had been holding it. I threw it away and hope it stays gone.",
"Walking home I felt someone behind me. Every time I turned nothing was there. My flashlight glitched and for a second a face appeared inches from mine. When the light steadied the street was empty. The footsteps matched mine all the way home. Something waited outside until sunrise.",
"I received a voicemail from my grandfather though he died last year. He whispered that he found a way back. The message dissolved into a scream. When I tried to replay it the recording was gone. My phone history showed no call. I still hear his voice at night.",
"Muddy footprints appeared in my hallway each morning. They always stopped at my bedroom door. One night I sprinkled flour on the floor. In the morning words were written in it saying you saw me. The footprints entered my room. I moved out the same day.",
"I explored an abandoned hospital with a friend. The halls felt too quiet. A lullaby echoed from somewhere deep inside. When we turned to leave the main doors slammed shut. The humming moved closer and closer. We ran and never went back.",
"Something knocked on my third story window one night. I pulled back the curtain and saw a pale face staring in. It mouthed words I could not hear. The lights flickered and the face vanished. A handprint remained on the glass. I sleep with the curtains closed now.",
"I heard someone humming in my bathroom late at night. The light was off and the door was closed. When I opened it the sound stopped instantly. I turned on the light and saw steam drifting as if someone had just showered. The mirror slowly fogged over. A message appeared saying you are not alone.",
"My closet door rattled every evening at the same time. I thought it was loose hinges. One night it swung wide open by itself. A long shadow stretched out across my bed. When I reached for the lamp something breathed on my neck. I sleep with the door nailed shut now.",
"I found a stranger standing in my driveway at midnight staring at my house. I turned on the porch light and he disappeared without moving. The next night he was closer. On the third night he stood outside my bedroom window on the second floor. I do not know how he got up there. I moved the next morning.",
"My radio turned on by itself and played a recording of my own voice. I had never said the words it spoke. It described exactly how I would die. Then the speaker crackled and screamed. The radio burst into static. I unplugged it but it still whispered.",
"My little cousin pointed at the kitchen ceiling and smiled. I looked up but saw nothing. He waved and said the floating man was coming down. A cold draft brushed past me. He giggled and hid behind a chair. I left the house immediately.",
"A picture frame in my living room kept tilting to the right. I straightened it dozens of times. One morning it lay face down on the floor with the glass cracked. Behind it on the wall was a handprint smeared in dust. It did not match mine. I never hung it up again.",
"I was camping alone and heard heavy footsteps circling my tent. I called out but the woods were silent. The steps got faster and closer. My tent zipper began to move. I held it shut with both hands shaking. Whatever it was left only when the sun rose.",
"I kept waking up with dirt on my feet. I checked the doors and windows but everything was locked. One night I set up a camera. In the footage I watched myself sleepwalk outside and kneel in the yard. Something in the shadows guided me back inside. I do not remember any of it.",
"I smelled perfume in my bedroom though I had no sprays. It was an old floral scent. The smell moved around the room like someone walking. Then I felt a hand stroke my hair. A woman whispered thank you for letting me in. I slept in my car after that.",
"I saw a child sitting alone on a swing near the woods. When I approached he vanished into thin air. The swing kept moving as if someone still sat on it. I heard giggling behind me. Leaves rustled though no wind blew. I ran all the way home.",
"My mirror reflection blinked when I did not. It smiled while I stared in horror. Then it stepped closer to the glass from the inside. My own image placed a hand flat against the surface. I backed away slowly. The smile has not faded in days.",
"My cat stared at the ceiling corner every night and hissed. One night her fur stood straight up and she backed away. I looked up and saw a dark shape crawl down the wall. I could not move or speak. Eventually it slipped under my bed. The cat refuses to enter my room now.",
"The streetlights flickered as I walked home. One went dark just as I stepped beneath it. I saw a figure leaning against the pole watching me. The next light went out and it moved closer. I ran as fast as I could. The lights behind me stayed dark.",
"I woke up to the sound of someone dragging something heavy in the hallway. My door handle twisted but did not open. I peeked under the door and saw a pair of bare feet standing there. They waited for hours without moving. When the sun rose the feet were gone. The scratch marks on the door remained.",
"The attic door thumped every night. I finally opened it and climbed up. The air felt cold and stale. I saw footprints leading across the dust. They ended at the far wall then disappeared up into nothing. I sealed the attic shut.",
"I got a phone call from my own number. When I answered I heard someone breathing heavily. Then I heard myself scream through the speaker. The call disconnected. My phone shut off on its own. I have not turned it back on.",
"In the laundromat I saw someone sitting alone at the far end staring at me. Each time I blinked he sat one seat closer. When I looked away and back he was suddenly right beside me. I smelled soil and rot. I ran outside and the lights flickered behind me. I never returned.",
"I dreamed of a woman crying outside my door. I woke up to real sobbing in the hallway. I opened the door and the sound stopped. A wet footstep marked the floor just inside. The crying started again on the other side of the wall. I did not check a second time.",
"My grandfather clock chimed at random times. I opened the case to fix it and found it empty. The pendulum was gone. That night it chimed every hour. In the morning the pendulum lay on my pillow. I threw the clock away.",
"A knock sounded from inside my bedroom wall. It answered when I knocked back. The knocks spelled out my name slowly. I backed away in fear. Then it knocked one last time and said coming through. I moved before it arrived."

  ],
  "Deep Love Story": [
    "We met in a rainstorm under a broken umbrella. Ten years later, I still carry that umbrella every day.",
    "He spent three years learning sign language in secret just to propose to me in my primary language.",
    "She left me a letter every single morning for 40 years. Today was the first morning I woke up to an empty nightstand."
  ],
  "Heartbreaking Breakup": [
    "We promised to meet in 5 years if we were both single. I've been sitting here for six hours, and the sun is setting.",
    "The hardest part wasn't saying goodbye, it was coming home to a house that still smelled like her perfume.",
    "I saw him at the grocery store today. He looked happy. He was buying the specific brand of coffee he used to hate."
  ],
  "Online Scam Mystery": [
    "I sent $5,000 to a 'friend in need' only to realize the friend had been dead for a month.",
    "A stranger sent me a link to a website that was a perfect live stream of my own bedroom.",
    "I bought a vintage laptop on eBay. The browser was already open to a document titled 'Reasons why I am watching you'."
  ],
  "Confessions": [
    "I've been living in my boss's attic for two weeks. He has no idea.",
    "I stole my brother's winning lottery ticket and watched him struggle for years.",
    "I never actually finished college, I just photoshopped my diploma to get this job."
  ],
  "Extreme Revenge": [
    "He ruined my career, so I bought the company he works for just to fire him on his birthday.",
    "She cheated, so I sold her rare car collection for $1 each to her worst enemies.",
    "They bullied me in high school. Now I'm their landlord and I just gave them a 30-day notice."
  ],
  "Life Changing Moment": [
    "I missed my flight by 5 minutes. That plane never landed.",
    "I found a bag containing $1 million and a burner phone that just started ringing.",
    "A stranger gave me a kidney and left the hospital before I could even say thank you."
  ],
  "Unexplained Paranormal": [
    "My cat stares at the corner and hisses at nothing every night at the exact same time.",
    "The radio in my car only plays songs that haven't been written yet.",
    "I found a photo of myself in an antique shop. The photo was taken in 1920."
  ],
  "Workplace Drama": [
    "I caught the CEO stealing leftovers from the breakroom fridge.",
    "My co-worker is actually three raccoons in a trench coat, and I'm the only one who noticed.",
    "I accidentally replied-all to the whole company with a voice note of me making fun of the manager."
  ],
  "Family Secret": [
    "My 'sister' sat me down today and told me she's actually my biological mother.",
    "Grandpa's old trunk was full of medals proving he was a double agent.",
    "There is a hidden room behind the library that my parents have forbidden me from entering."
  ]
};

export default function RedditPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Form állapotok
  const [selectedStory, setSelectedStory] = useState("Scary Encounter");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [selectedVideo, setSelectedVideo] = useState("video1.mp4");
  const [selectedSound, setSelectedSound] = useState("Narrator Alpha");

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      const { data } = await supabase.from('users').select('credits').eq('id', user.id).single();
      if (data) setUserCredits(data.credits);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  // Szám formázása: 10000 -> 10.0K
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => router.back()} style={styles.backBtn}>← Back to Dashboard</button>
          <div style={styles.creditBadge}>🪙 {userCredits} Credits</div>
        </div>

        <div style={styles.mainCard}>
          <div style={styles.grid}>
            
            {/* BAL OLDAL: SZERKESZTŐ */}
            <div style={styles.column}>
              <h2 style={styles.sectionTitle}>Reddit Story Forge</h2>
              
              <label style={styles.label}>STORY CATEGORY</label>
              <select style={styles.select} value={selectedStory} onChange={(e) => setSelectedStory(e.target.value)}>
                {Object.keys(storyData).map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label style={styles.label}>AUTHOR (MAX 10 CHARS)</label>
              <input style={styles.input} maxLength={10} placeholder="e.g. Ben" value={name} onChange={(e) => setName(e.target.value)} />

              <label style={styles.label}>PROFILE AVATAR</label>
              <button style={styles.uploadBtn} onClick={() => fileRef.current?.click()}>
                {profileImage ? "Image Uploaded ✓" : "Upload Custom Avatar"}
              </button>
              <input ref={fileRef} type="file" style={{display: 'none'}} accept="image/*" onChange={handleFileUpload} />

              <div style={styles.row}>
                <div style={{flex:1}}><label style={styles.label}>LIKES</label><input style={styles.input} type="number" value={likes} onChange={(e)=>setLikes(Number(e.target.value))} /></div>
                <div style={{flex:1}}><label style={styles.label}>COMMENTS</label><input style={styles.input} type="number" value={comments} onChange={(e)=>setComments(Number(e.target.value))} /></div>
              </div>
              
              <button style={styles.createBtn}>CREATE VIDEO NOW</button>
            </div>

            {/* JOBB OLDAL: ÉLŐ PREVIEW */}
            <div style={styles.column}>
              <h3 style={{...styles.label, textAlign: 'center', marginBottom: '15px'}}>LIVE PREVIEW</h3>
              
              <div style={styles.previewCard}>
                <div style={styles.redditWrapper}>
                  {/* ALAP SABLON */}
                  <img src="/Reddit.png" style={styles.templateBase} alt="Reddit template" />
                  
                  {/* PROFILKÉP (Pontosan a szürke kör helyére) */}
                  <div style={styles.avatarContainer}>
                    {profileImage ? (
                      <img src={profileImage} style={styles.avatarImg} alt="pfp" />
                    ) : (
                      <div style={styles.avatarPlaceholder} />
                    )}
                  </div>

                  {/* NÉV (A pipa mellé balra) */}
                  <div style={styles.usernameText}>
                    {name || "Username"}
                  </div>

                  {/* TÖRTÉNET SZÖVEG */}
                  <div style={styles.storyContent}>
                    {storyData[selectedStory][0]}
                  </div>

                  {/* LÁJKOK ÉS KOMMENTEK SZÁMA */}
                  <div style={styles.statsRow}>
                    <span style={styles.statItem}>{formatNumber(likes)}</span>
                    <span style={{...styles.statItem, marginLeft: '58px'}}>{formatNumber(comments)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: { minHeight: '100vh', backgroundColor: '#030712', color: 'white', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', padding: '20px' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  backBtn: { background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' },
  creditBadge: { backgroundColor: '#111827', padding: '8px 16px', borderRadius: '20px', border: '1px solid #10b981' },
  mainCard: { backgroundColor: '#0b0f1a', borderRadius: '16px', padding: '30px', border: '1px solid #1f2937' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' },
  column: { display: 'flex', flexDirection: 'column', gap: '15px' },
  sectionTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
  label: { fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '8px', backgroundColor: '#030712', border: '1px solid #1f2937', color: 'white', outline: 'none' },
  select: { padding: '12px', borderRadius: '8px', backgroundColor: '#030712', border: '1px solid #1f2937', color: 'white' },
  uploadBtn: { padding: '12px', borderRadius: '8px', border: '1px dashed #10b981', color: '#10b981', backgroundColor: 'transparent', cursor: 'pointer' },
  row: { display: 'flex', gap: '15px' },
  createBtn: { marginTop: '10px', padding: '16px', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' },
  
  // PREVIEW SPECIFIKUS STÍLUSOK
  previewCard: { backgroundColor: 'white', borderRadius: '8px', padding: '10px', display: 'flex', justifyContent: 'center' },
  redditWrapper: { position: 'relative', width: '100%', maxWidth: '450px' },
  templateBase: { width: '100%', display: 'block' },
  
  avatarContainer: { 
    position: 'absolute', 
    top: '7.5%', 
    left: '6.5%', 
    width: '18%', 
    height: '24%', 
    borderRadius: '50%', 
    overflow: 'hidden' 
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', backgroundColor: '#d1d1d1' },

  usernameText: { 
    position: 'absolute', 
    top: '12.5%', 
    left: '27%', 
    color: '#1a1a1b', 
    fontWeight: '700', 
    fontSize: '15px',
    fontFamily: 'inherit'
  },

  storyContent: { 
    position: 'absolute', 
    top: '29%', 
    left: '8%', 
    right: '8%', 
    color: '#1a1a1b', 
    fontSize: '13.5px', 
    lineHeight: '1.5',
    textAlign: 'left',
    display: '-webkit-box',
    WebkitLineClamp: 7, // Hogy ne lógjon ki a képből
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },

  statsRow: { 
    position: 'absolute', 
    bottom: '7.5%', 
    left: '11%', 
    display: 'flex', 
    alignItems: 'center',
    width: '50%'
  },
  statItem: { 
    color: '#878a8c', 
    fontSize: '11px', 
    fontWeight: '700',
    minWidth: '30px'
  },
  
  loading: { textAlign: 'center', color: '#10b981', marginTop: '50px' }
};