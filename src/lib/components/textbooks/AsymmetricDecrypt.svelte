<div class="textbook-page">
	<h2>Asymmetric Decryption</h2>
	<p>
		Asymmetric encryption solves the key distribution problem by using two different keys: a <strong>public key</strong>
		and a <strong>private key</strong>. These keys are mathematically linked—what one key encrypts, only the other can
		decrypt.
	</p>

	<h3>How It Works</h3>
	<ol>
		<li><strong>Key Pair:</strong> Generate a public key and private key together</li>
		<li><strong>Share Public Key:</strong> Anyone can have your public key; it's not secret</li>
		<li><strong>Others Encrypt:</strong> Others use your public key to encrypt messages to you</li>
		<li><strong>You Decrypt:</strong> You use your private key (which only you have) to decrypt messages</li>
	</ol>

	<h3>Why It's Secure</h3>
	<p>
		Even if someone intercepts the ciphertext and has the public key, they cannot decrypt it. The private key is the
		only way to decrypt, and it's <strong>never shared</strong>. This makes asymmetric encryption extremely valuable for
		secure communication over public channels.
	</p>

	<h3>The Trade-off</h3>
	<ul>
		<li><strong>Pro:</strong> No need to securely share a secret key beforehand</li>
		<li><strong>Con:</strong> Much slower than symmetric encryption (due to complex mathematics)</li>
	</ul>

	<h3>Practical Use</h3>
	<p>
		In practice, asymmetric encryption is often used to securely exchange a <strong>symmetric key</strong>, which is then used for encrypting large amounts of data. This gives you the security benefits of both systems!
	</p>

	<h3>Digital Signatures</h3>
	<p>
		Asymmetric keys also enable digital signatures. If you encrypt something with your <strong>private</strong> key, anyone with your <strong>public</strong> key can decrypt it. This proves you created the message (authentication and non-repudiation).
	</p>
</div>

<style>
	.textbook-page {
		padding: 24px;
		font-family: serif;
		line-height: 1.8;
		color: #333;
	}

	h2 {
		font-size: 28px;
		margin-bottom: 16px;
		text-align: center;
		color: #1a5f3c;
		border-bottom: 2px solid #d4a574;
		padding-bottom: 12px;
	}

	h3 {
		font-size: 18px;
		margin-top: 20px;
		margin-bottom: 12px;
		color: #2a6b48;
	}

	p {
		margin-bottom: 12px;
	}

	ol, ul {
		margin: 12px 0 12px 24px;
	}

	li {
		margin-bottom: 8px;
	}

	strong {
		color: #1a5f3c;
	}
</style>
