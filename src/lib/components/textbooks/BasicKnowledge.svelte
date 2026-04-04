<div class="textbook-page">
	<h2>Basic Knowledge</h2>
	<p>
		In the world of encryption, three concepts are often confused: <strong>Symmetric Encryption</strong>,
		<strong>Asymmetric Encryption</strong>, and <strong>Hashing</strong>. Understanding the distinctions between
		them is crucial for grasping how modern cryptography works.
	</p>

	<h3>Symmetric Encryption</h3>
	<p>
		Symmetric encryption uses a <strong>single shared key</strong> to both encrypt and decrypt messages. Alice and
		Bob share the same secret key. When Alice encrypts a message with the key, only Bob (who has the same key) can
		decrypt it.
	</p>
	<p><em>Analogy:</em> Two people with identical copies of a lock and key. Both can lock and unlock the same chest.</p>

	<h3>Asymmetric Encryption</h3>
	<p>
		Asymmetric encryption uses a <strong>pair of keys</strong>: a public key and a private key. The public key can
		encrypt messages, but only the corresponding private key can decrypt them. This solves the key distribution
		problem—Alice can share her public key with anyone, and they can send her encrypted messages.
	</p>
	<p><em>Analogy:</em> A mailbox. Anyone can drop a letter in (using the public key), but only the owner (private key holder) can open it.</p>

	<h3>Hashing</h3>
	<p>
		Hashing is <strong>not encryption</strong>. A hash function takes any input and produces a fixed-size output
		(the hash). It is a <strong>one-way function</strong>—you cannot decrypt a hash back to the original message.
		Instead, hashes are used for verification and integrity checking.
	</p>
	<p><em>Analogy:</em> A fingerprint. You can verify a person's fingerprint matches a record, but you can't reconstruct the person from their fingerprint.</p>

	<h3>When to Use Each</h3>
	<ul>
		<li><strong>Symmetric:</strong> Fast, good for encrypting large amounts of data when you already share a key.</li>
		<li><strong>Asymmetric:</strong> Good for secure key exchange and digital signatures.</li>
		<li><strong>Hashing:</strong> Verify data integrity and store passwords securely.</li>
	</ul>
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

	em {
		font-style: italic;
		color: #555;
	}

	ul {
		margin: 12px 0 12px 24px;
	}

	li {
		margin-bottom: 8px;
	}
</style>
