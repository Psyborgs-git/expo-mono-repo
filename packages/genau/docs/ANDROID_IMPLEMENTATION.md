# Android Implementation Guide

This guide provides detailed instructions for implementing the actual LLM functionality in the Android native module.

## Prerequisites

- Android Studio Arctic Fox or later
- Android SDK 24 (Android 7.0) or later
- Kotlin 1.9.20 or later
- Gradle 8.0 or later

## Architecture

The Android implementation uses:
- **Expo Modules** for bridging Kotlin to JavaScript
- **Google ML Kit** with Gemini Nano for on-device LLM
- **MediaPipe LLM Inference API** (alternative)
- **TensorFlow Lite** (alternative for custom models)

## Recommended Models for Android

- `gemini-nano` (Google's on-device model, best integration)
- `gemini-1.5-flash-lite` (Lighter version)
- Custom GGUF models converted for mobile

## Step 1: Add Dependencies

Update `android/build.gradle`:

```gradle
plugins {
  id("com.android.library")
  id("kotlin-android")
}

android {
  namespace = "expo.modules.genau"
  compileSdk = 34

  defaultConfig {
    minSdk = 24
    targetSdk = 34
  }

  buildTypes {
    release {
      isMinifyEnabled = false
    }
  }
}

dependencies {
  implementation(project(":expo-modules-core"))
  implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.9.20")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
  implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
  
  // Google AI Client SDK for Gemini Nano
  implementation("com.google.ai.client.generativeai:generativeai:0.1.0")
  
  // Or for MediaPipe (alternative)
  // implementation("com.google.mediapipe:tasks-genai:0.10.0")
}
```

## Step 2: Initialize Gemini Nano

Update `GenauModule.kt`:

```kotlin
package expo.modules.genau

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.generationConfig
import kotlinx.coroutines.flow.Flow

class GenauModule : Module() {
  private var generativeModel: GenerativeModel? = null
  private var config: GenauConfiguration? = null
  private var isInitialized: Boolean = false
  
  override fun definition() = ModuleDefinition {
    Name("Genau")
    
    Events(
      "modelDownloadProgress",
      "modelDownloadComplete",
      "modelDownloadError",
      "streamChunk",
      "streamComplete",
      "streamError"
    )
    
    AsyncFunction("initialize") { config: GenauConfiguration ->
      this@GenauModule.config = config
      
      try {
        // Initialize Gemini model
        generativeModel = GenerativeModel(
          modelName = config.modelId, // e.g., "gemini-nano"
          generationConfig = generationConfig {
            temperature = config.temperature?.toFloat() ?: 0.7f
            topK = config.topK ?: 40
            topP = config.topP?.toFloat() ?: 0.9f
            maxOutputTokens = config.maxTokens ?: 256
          }
        )
        
        isInitialized = true
        println("Genau initialized with model: ${config.modelId}")
      } catch (e: Exception) {
        throw Exception("Failed to initialize Genau: ${e.message}")
      }
    }
  }
}
```

## Step 3: Implement Text Generation

```kotlin
AsyncFunction("generate") { messages: List<GenauMessageRecord>, configOverrides: GenauConfiguration? ->
  if (!isInitialized || generativeModel == null) {
    throw Exception("Module not initialized")
  }
  
  val startTime = System.currentTimeMillis()
  
  // Format messages into prompt
  val prompt = formatMessagesForModel(messages)
  
  try {
    // Generate response
    val response = generativeModel!!.generateContent(prompt)
    val responseText = response.text ?: ""
    
    val endTime = System.currentTimeMillis()
    val generationTime = (endTime - startTime).toDouble()
    
    GenauResponseRecord().apply {
      text = responseText
      tokensGenerated = estimateTokenCount(responseText)
      this.generationTime = generationTime
      stopReason = "complete"
    }
  } catch (e: Exception) {
    throw Exception("Generation failed: ${e.message}")
  }
}

private fun formatMessagesForModel(messages: List<GenauMessageRecord>): String {
  // Format depends on model requirements
  val prompt = StringBuilder()
  
  messages.forEach { message ->
    when (message.role) {
      "system" -> prompt.append("System: ${message.content}\n\n")
      "user" -> prompt.append("User: ${message.content}\n\n")
      "assistant" -> prompt.append("Assistant: ${message.content}\n\n")
    }
  }
  
  prompt.append("Assistant: ")
  return prompt.toString()
}

private fun estimateTokenCount(text: String): Int {
  // Rough estimation: ~4 characters per token
  return (text.length / 4).coerceAtLeast(1)
}
```

## Step 4: Implement Streaming Generation

```kotlin
AsyncFunction("generateStream") { messages: List<GenauMessageRecord>, configOverrides: GenauConfiguration? ->
  if (!isInitialized || generativeModel == null) {
    throw Exception("Module not initialized")
  }
  
  isGenerating = true
  val prompt = formatMessagesForModel(messages)
  
  moduleScope.launch {
    try {
      var tokenCount = 0
      
      generativeModel!!.generateContentStream(prompt).collect { chunk ->
        if (!isGenerating) {
          return@collect
        }
        
        val chunkText = chunk.text ?: ""
        tokenCount += estimateTokenCount(chunkText)
        
        sendEvent("streamChunk", mapOf(
          "text" to chunkText,
          "isComplete" to false,
          "tokenCount" to tokenCount
        ))
      }
      
      // Stream completed
      sendEvent("streamChunk", mapOf(
        "text" to "",
        "isComplete" to true,
        "tokenCount" to tokenCount
      ))
      sendEvent("streamComplete", emptyMap<String, Any>())
      isGenerating = false
      
    } catch (e: Exception) {
      sendEvent("streamError", mapOf(
        "error" to (e.message ?: "Unknown error")
      ))
      isGenerating = false
    }
  }
}
```

## Step 5: Implement Model Management

```kotlin
AsyncFunction("isModelAvailable") { modelId: String ->
  // Check if Gemini Nano is available
  // This depends on Google Play Services and device compatibility
  try {
    val model = GenerativeModel(modelName = modelId)
    true
  } catch (e: Exception) {
    false
  }
}

AsyncFunction("getAvailableModels") {
  // Return list of available Gemini models
  listOf(
    GenauModelInfoRecord().apply {
      id = "gemini-nano"
      name = "Gemini Nano"
      size = 1_500_000_000L // Approximate
      isDownloaded = isGeminiNanoAvailable()
      capabilities = listOf("chat", "completion", "summarization")
    },
    GenauModelInfoRecord().apply {
      id = "gemini-1.5-flash-lite"
      name = "Gemini 1.5 Flash Lite"
      size = 800_000_000L
      isDownloaded = false
      capabilities = listOf("chat", "completion")
    }
  )
}

private fun isGeminiNanoAvailable(): Boolean {
  // Check if Gemini Nano is downloaded via Google Play Services
  return try {
    // This is a placeholder - actual check depends on Google Play Services API
    true
  } catch (e: Exception) {
    false
  }
}
```

## Step 6: Handle Permissions

Add to `AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-permission android:name="android.permission.INTERNET" />
  
  <!-- For Gemini Nano -->
  <queries>
    <package android:name="com.google.android.gms" />
  </queries>
</manifest>
```

## Step 7: Testing

Create JUnit tests in `android/src/test/`:

```kotlin
package expo.modules.genau

import org.junit.Test
import org.junit.Assert.*
import kotlinx.coroutines.runBlocking

class GenauModuleTest {
    private val module = GenauModule()
    
    @Test
    fun testModuleCreation() {
        assertNotNull(module)
    }
    
    @Test
    fun testInitialization() = runBlocking {
        val config = GenauConfiguration().apply {
            modelId = "gemini-nano"
            maxTokens = 100
            temperature = 0.7
        }
        
        // This will fail until actual implementation is done
        // module.initialize(config)
    }
    
    // Add more tests...
}
```

## Troubleshooting

### Gemini Nano Not Available

Gemini Nano requires:
- Android 12 or later
- Google Play Services with AI features
- Sufficient device RAM (8GB+ recommended)

Check availability:
```kotlin
val isAvailable = GoogleApiAvailability.getInstance()
  .isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
```

### Performance Issues

1. **Enable GPU acceleration** in TensorFlow Lite
2. **Use quantized models** (INT8 or INT4)
3. **Implement caching** for repeated requests
4. **Profile with Android Profiler** to identify bottlenecks

## Additional Resources

- [Google AI Studio](https://ai.google.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [MediaPipe LLM Inference](https://developers.google.com/mediapipe/solutions/genai/llm_inference)
- [Expo Modules API](https://docs.expo.dev/modules/module-api/)
