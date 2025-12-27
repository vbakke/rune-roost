import type { Test } from '$lib/components/TestArea.svelte';

export interface Lesson {
	id: string;
	title: string;
	realm: 'symmetric' | 'asymmetric' | 'hashing';
	pages: string[];
	tests: Test[];
}

export const lessons: Record<string, Lesson> = {
	symmetric: {
		id: 'symmetric',
		title: 'Symmetric Encryption',
		realm: 'symmetric',
		pages: [
			`
				<h3>What is Symmetric Encryption?</h3>
				<p>Symmetric encryption is like having a single key that both locks and unlocks a chest. Both the sender and receiver use the same secret key to encrypt and decrypt messages.</p>
				<p>Think of it as a shared secret password that only you and your friend know. When you want to send a secret message, you scramble it using this password. Your friend can then unscramble it using the same password.</p>
			`,
			`
				<h3>How Does It Work?</h3>
				<p>The process is simple:</p>
				<p>1. <strong>Alice</strong> has a message: "Hello"</p>
				<p>2. <strong>Alice</strong> and <strong>Bob</strong> both know the secret key: 42</p>
				<p>3. <strong>Alice</strong> encrypts by adding: "Hello" + 42 = encrypted message</p>
				<p>4. <strong>Bob</strong> decrypts by subtracting: encrypted message - 42 = "Hello"</p>
			`,
			`
				<h3>The Key Challenge</h3>
				<p>The biggest problem with symmetric encryption is: <em>How do you share the key securely?</em></p>
				<p>If someone intercepts your key while you're sharing it, they can read all your encrypted messages!</p>
				<p>This is why symmetric encryption works best when:</p>
				<ul>
					<li>You can meet in person to share the key</li>
					<li>You use it for encrypting your own data (like hard drives)</li>
					<li>You combine it with other methods to share the key safely</li>
				</ul>
			`,
			`
				<h3>Real World Examples</h3>
				<p><strong>AES (Advanced Encryption Standard)</strong> is the most common symmetric encryption algorithm today. It's used to:</p>
				<ul>
					<li>Encrypt files on your computer</li>
					<li>Protect data on your phone</li>
					<li>Secure WiFi connections (WPA2/WPA3)</li>
					<li>Encrypt hard drives and USB drives</li>
				</ul>
				<p>AES is incredibly fast and secure, making it perfect for encrypting large amounts of data.</p>
			`
		],
		tests: [
			{
				id: 'sym-1',
				type: 'multiple-choice',
				question: 'In symmetric encryption, how many keys are used?',
				options: ['One key shared by both parties', 'Two keys: public and private', 'Three keys: sender, receiver, and validator', 'No keys are needed'],
				correctAnswer: 'One key shared by both parties',
				explanation: 'Symmetric encryption uses a single shared key for both encryption and decryption.'
			},
			{
				id: 'sym-2',
				type: 'multiple-choice',
				question: 'What is the main challenge with symmetric encryption?',
				options: ['It is too slow', 'Sharing the key securely', 'It cannot encrypt large files', 'It requires internet connection'],
				correctAnswer: 'Sharing the key securely',
				explanation: 'The key distribution problem is the main challenge - both parties need the same secret key, but sharing it securely can be difficult.'
			},
			{
				id: 'sym-3',
				type: 'multiple-choice',
				question: 'Which of these is a real-world use of symmetric encryption?',
				options: ['Digital signatures', 'WiFi WPA2 encryption', 'Bitcoin transactions', 'Email verification'],
				correctAnswer: 'WiFi WPA2 encryption',
				explanation: 'WPA2 WiFi encryption uses symmetric encryption (AES) to protect your wireless network traffic.'
			}
		]
	},
	asymmetric: {
		id: 'asymmetric',
		title: 'Asymmetric Encryption',
		realm: 'asymmetric',
		pages: [
			`
				<h3>What is Asymmetric Encryption?</h3>
				<p>Asymmetric encryption uses two different keys: a <strong>public key</strong> and a <strong>private key</strong>. Think of it like a mailbox:</p>
				<p>The public key is like the mail slot - anyone can drop a letter in (encrypt a message).</p>
				<p>The private key is like the mailbox key - only you can open it and read the letters (decrypt the messages).</p>
			`,
			`
				<h3>How Does It Work?</h3>
				<p>The magic of asymmetric encryption:</p>
				<p>1. <strong>Bob</strong> creates a key pair: public key and private key</p>
				<p>2. <strong>Bob</strong> shares his public key with everyone (it's safe!)</p>
				<p>3. <strong>Alice</strong> encrypts her message using Bob's public key</p>
				<p>4. Only <strong>Bob</strong> can decrypt it using his private key</p>
				<p>The beautiful part: even though Alice used Bob's public key to encrypt, she cannot decrypt the message herself!</p>
			`,
			`
				<h3>The Key Advantage</h3>
				<p>Asymmetric encryption solves the key distribution problem!</p>
				<p>You can freely share your public key with anyone - post it on your website, send it by email, shout it from the rooftops. It doesn't matter if someone intercepts it.</p>
				<p>Only the private key needs to be kept secret, and it never needs to be shared with anyone.</p>
			`,
			`
				<h3>Real World Examples</h3>
				<p><strong>RSA</strong> is the most famous asymmetric encryption algorithm. It's used for:</p>
				<ul>
					<li>HTTPS websites (the padlock in your browser)</li>
					<li>Digital signatures</li>
					<li>Email encryption (PGP/GPG)</li>
					<li>SSH keys for secure server access</li>
					<li>Bitcoin and cryptocurrency wallets</li>
				</ul>
				<p>The trade-off: Asymmetric encryption is much slower than symmetric, so it's often used to securely exchange a symmetric key!</p>
			`
		],
		tests: [
			{
				id: 'asym-1',
				type: 'multiple-choice',
				question: 'How many keys does asymmetric encryption use?',
				options: ['One shared key', 'Two keys: public and private', 'Three keys', 'No keys'],
				correctAnswer: 'Two keys: public and private',
				explanation: 'Asymmetric encryption uses a key pair: a public key for encryption and a private key for decryption.'
			},
			{
				id: 'asym-2',
				type: 'multiple-choice',
				question: 'Which key should be kept secret?',
				options: ['Public key', 'Private key', 'Both keys', 'Neither key'],
				correctAnswer: 'Private key',
				explanation: 'The private key must be kept secret. The public key can be shared freely with anyone.'
			},
			{
				id: 'asym-3',
				type: 'multiple-choice',
				question: 'What is a disadvantage of asymmetric encryption compared to symmetric?',
				options: ['Less secure', 'Much slower', 'Cannot encrypt large files at all', 'Requires internet connection'],
				correctAnswer: 'Much slower',
				explanation: 'Asymmetric encryption is computationally more expensive and slower than symmetric encryption, which is why it\'s often used to exchange symmetric keys.'
			}
		]
	},
	hashing: {
		id: 'hashing',
		title: 'Hashing',
		realm: 'hashing',
		pages: [
			`
				<h3>What is Hashing?</h3>
				<p>Hashing is <strong>NOT</strong> encryption! It's important to understand this difference.</p>
				<p>A hash function takes any input (like a password or file) and produces a fixed-size "fingerprint" called a hash. Think of it like a one-way blender:</p>
				<p>You can put ingredients in and get a smoothie out, but you can't reverse the process to get the original ingredients back!</p>
			`,
			`
				<h3>Key Properties of Hashing</h3>
				<p><strong>1. One-way:</strong> You can't reverse a hash to get the original input</p>
				<p><strong>2. Deterministic:</strong> Same input always produces the same hash</p>
				<p><strong>3. Fast:</strong> Computing a hash is quick</p>
				<p><strong>4. Collision-resistant:</strong> Hard to find two different inputs that produce the same hash</p>
				<p><strong>5. Avalanche effect:</strong> Small change in input = completely different hash</p>
			`,
			`
				<h3>Why Use Hashing?</h3>
				<p>Hashing is perfect when you need to:</p>
				<ul>
					<li><strong>Verify data integrity:</strong> Check if a file was modified</li>
					<li><strong>Store passwords:</strong> Don't store the actual password, store its hash!</li>
					<li><strong>Digital signatures:</strong> Sign a hash instead of the whole document</li>
					<li><strong>Data structures:</strong> Hash tables for fast lookups</li>
				</ul>
				<p>Remember: If you need to get the original data back, use encryption. If you only need to verify or compare, use hashing.</p>
			`,
			`
				<h3>Real World Examples</h3>
				<p>Common hashing algorithms:</p>
				<p><strong>SHA-256:</strong> Used in Bitcoin, file verification, digital signatures</p>
				<p><strong>bcrypt:</strong> Designed specifically for password hashing (includes salt and is intentionally slow)</p>
				<p><strong>MD5:</strong> Old and broken - DO NOT USE for security (but still okay for checksums)</p>
				<p>When you download software, you often see a "checksum" or "hash" - you can compute the hash of your download and compare it to verify the file wasn't tampered with.</p>
			`
		],
		tests: [
			{
				id: 'hash-1',
				type: 'multiple-choice',
				question: 'Can you decrypt a hash to get the original data?',
				options: ['Yes, with the right key', 'No, hashing is one-way', 'Yes, but it takes a long time', 'Only with quantum computers'],
				correctAnswer: 'No, hashing is one-way',
				explanation: 'Hashing is a one-way function. You cannot reverse a hash to get the original input - this is what makes it different from encryption.'
			},
			{
				id: 'hash-2',
				type: 'multiple-choice',
				question: 'What happens if you hash the same input twice?',
				options: ['You get two different hashes', 'You get the same hash both times', 'The second hash is stronger', 'It produces an error'],
				correctAnswer: 'You get the same hash both times',
				explanation: 'Hash functions are deterministic - the same input always produces the same hash output.'
			},
			{
				id: 'hash-3',
				type: 'multiple-choice',
				question: 'Why do websites hash passwords instead of encrypting them?',
				options: ['Hashing is faster', 'They don\'t need to retrieve the original password', 'Hashing uses less storage', 'Encryption is illegal'],
				correctAnswer: 'They don\'t need to retrieve the original password',
				explanation: 'Websites only need to verify that you entered the correct password, not retrieve the original. Hashing prevents anyone (including the website owners) from seeing your actual password.'
			}
		]
	}
};
