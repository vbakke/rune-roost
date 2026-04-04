<div class="textbook-page">
	<h2>Hashing: Not Decryption</h2>
	<p>
		One of the most important concepts to understand: <strong>Hashing is not encryption.</strong> A hash function is a
		<strong>one-way function</strong>. You cannot decrypt a hash back to the original message, no matter how hard you try.
	</p>

	<h3>What is a Hash Function?</h3>
	<p>
		A hash function takes an input of any size and produces a fixed-size output called a <strong>hash</strong> or
		<strong>digest</strong>. The function is designed to:
	</p>
	<ul>
		<li>Always produce the same hash for the same input (deterministic)</li>
		<li>Produce a completely different hash for even a tiny change in input (avalanche effect)</li>
		<li>Be computationally impossible to reverse (one-way)</li>
		<li>Make it extremely hard to find two inputs that produce the same hash (collision resistant)</li>
	</ul>

	<h3>Why You Can't "Decrypt" a Hash</h3>
	<p>
		Consider a real-world analogy: crushing a glass into powder. You can recognize the color of the powder (the hash),
		but you cannot reconstruct the original glass (the input). Information is lost in the process, so reversal is
		impossible.
	</p>
	<p>
		The same applies to hashing. When you hash a password or a file, the function is designed to be <strong>one-way</strong>.
		No "decryption key" exists. The function is irreversible by design.
	</p>

	<h3>Common Uses for Hashing</h3>
	<ul>
		<li><strong>Password Storage:</strong> Store hashes of passwords, not the passwords themselves</li>
		<li><strong>Integrity Verification:</strong> Verify that a file hasn't been corrupted or tampered with</li>
		<li><strong>Checksums:</strong> Detect errors in transmitted data</li>
		<li><strong>Digital Signatures:</strong> Hash a message before encrypting it (for efficiency)</li>
	</ul>

	<h3>Examples of Hash Functions</h3>
	<p>
		Common cryptographic hash functions include <strong>MD5</strong> (older, now weak), <strong>SHA-1</strong>, and
		<strong>SHA-256</strong>. These produce hashes of fixed length, making them useful for various security applications.
	</p>

	<h3>The Bottom Line</h3>
	<p>
		<strong>Hashing is for verification, not secrecy.</strong> Use encryption when you want to keep data secret and
		recover it later. Use hashing when you want to verify data integrity or securely store passwords.
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

	ul {
		margin: 12px 0 12px 24px;
	}

	li {
		margin-bottom: 8px;
	}

	strong {
		color: #1a5f3c;
	}
</style>
