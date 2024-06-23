<template>
  <div :id="id" class="card">
    <div class="card-container">
      <div class="card-background">
        <div class="card-frame">
          <div class="card-header">
            <div class="card-school"><span :class="'icon icon-' + card.school.index"></span></div>
            <h4>{{ card.name }}</h4>
            <div class="card-level">{{ card.level }}</div>
          </div>
          <div class="card-container-image">
            <img v-if="!(card.changeImage ?? false)" class="card-image" v-bind:src="getImageUrl(card)" :alt="card.name" />
            <div v-else class="card-container-image-change">
              <h4>Change this image</h4>
              <input type="text" v-model="card.image" placeholder="Enter image URL" />
              <button class="btn btn-primary" @click="changeImage()">Save</button>
            </div>
          </div>
          <div class="card-container-data">
            <div class="card-container-attibutes">
              <div class="card-attibute">
                <span class="icon icon-range"></span>
                <span>{{ card.range }}</span>
              </div>
              <div class="card-divider"></div>
              <div class="card-attibute">
                <span class="icon icon-casting-time"></span>
                <span>{{ card.casting_time }}</span>
              </div>
              <div class="card-divider"></div>
              <div class="card-attibute">
                <span class="icon icon-duration"></span>
                <span>{{ card.duration }}</span>
              </div>
            </div>
            <div class="card-description">
              <p v-for="description in card.desc">{{ description }}</p>
            </div>
            <div class="card-container-specs">
              <div class="card-spec">
                <span v-if="card.concentration" class="icon icon-concentration"></span>
                <span v-else class="icon icon-concentration icon-negate"></span>
              </div>
              <div class="card-divider"></div>
              <div class="card-spec">
                <span v-if="card.ritual" class="icon icon-ritual"></span>
                <span v-else class="icon icon-ritual icon-negate"></span>
              </div>
              <div class="card-divider"></div>
              <div class="card-spec">
                <span v-if="card.components.includes('S')" class="icon icon-somatic"></span>
                <span v-else class="icon icon-somatic icon-negate"></span>
              </div>
              <div class="card-spec">
                <span v-if="card.components.includes('V')" class="icon icon-verbal"></span>
                <span v-else class="icon icon-verbal icon-negate"></span>
              </div>
              <div class="card-spec">
                <span v-if="card.components.includes('M')" class="icon icon-material"></span>
                <span v-else class="icon icon-material icon-negate"></span>
              </div>
              <div class="card-divider"></div>
              <div class="card-spec card-materials">
                <span v-if="card.components.includes('M')">{{ card.material }}</span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-actions-container not-printable">
      <h4>Actions:</h4>
      <button class="btn btn-primary" @click="deleteCard">Remove Card</button>
      <button class="btn btn-primary" @click="card.changeImage = true">Change Image</button>
    </div>
    <pre>{{ card }}</pre>
  </div>
</template>
<script lang="ts" allowJs>
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Card',
  props: {
    id: { required: true, type: String },
    card: { required: true, type: Object },
  },
  methods: {
    deleteCard() {
      console.log('Delete card', this.card);
      this.$emit('delete-selected-card', this.card);
    },
    getImageUrl(card: any) {
      if (card.image) {
        return card.image;
      }
      var index = card.index;
      var images = require.context('../assets/card/', false, /\.png$/);
      try {
        return images('./' + index + ".png");
      } catch (e) {
        return images('./Spell-not-found.png');
      }
    },
    changeImage() {
      this.card.changeImage = false;
      this.$emit('change-selected-card-image', this.card);
    }
  },
});
</script>
<style lang="scss">
.card {
  display: flex;
  flex-direction: row;

  &-container {
    border: 1px solid black;
    width: 500px;
    height: 640px;
    padding-bottom: 20px;
    margin-right: 1vw;
    border-radius: 25px;
    box-sizing: border-box;
    box-shadow: -8px 9px 16px -3px gray;
    background: #171314;

    &-image {
      padding: 5px;
      border-end-end-radius: 10px;
      border-start-start-radius: 10px;
      background-color: white;
      min-height: 40%;

      &-change {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
      }
    }

    &-data {
      margin-top: 5px;
      padding: 5px;
      border-end-start-radius: 10px;
      border-start-end-radius: 10px;
      background-color: beige;
    }

    &-attibutes {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      border-bottom: 1px solid #4d4d4d5e;
    }

    &-specs {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      max-height: 35px;
      border-top: 1px solid #4d4d4d5e;
    }
  }

  &-background {
    height: 600px;
    margin: 20px 20px 0 20px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 8%;
    border-bottom-right-radius: 8%;
    background-color: #bbb;
    z-index: 0;
  }

  &-frame {
    z-index: 1;
    position: relative;
    height: 108%;
    max-width: 97%;
    left: 1%;
    top: 0.5%;
    left: 1.2%;
    display: flex;
    flex-direction: column;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &-image {
    object-fit: cover;
    max-height: 250px;
    max-width: calc(250px * 16 / 9);
    height: 100%;
    width: 100%;
  }

  &-materials {
    width: 35%;
    font-size: clamp(10px, 60%, 20px);
    font-style: italic;
  }

  &-description {
    height: 210px;
    padding: 10px 5px;

    p {
      margin: 0;
      font-size: 10px;
      text-align: justify;
      font-style: italic;
    }
  }

  &-divider {
    background-color: #4d4d4d5e;
    width: 1px;
  }

  &-actions-container {
    display: flex;
    flex-direction: column;
  }

  pre {
    display: none;
  }
}

</style>